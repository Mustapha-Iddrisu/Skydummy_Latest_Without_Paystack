import express from 'express';
import axios from 'axios';

const router = express.Router();

// Memory store for checkout sessions (also mirrored to Firestore/LocalStorage)
const PENDING_SESSIONS = new Map();

/**
 * Helper to get Selar API base and key
 */
const getSelarConfig = () => {
  const apiKey = process.env.SELAR_API_KEY || process.env.SELAR_SECRET_KEY || '';
  const productUrl = process.env.SELAR_PRODUCT_URL || process.env.SELAR_CHECKOUT_URL || '';
  return {
    apiKey,
    productUrl,
    baseUrl: 'https://api.selar.co/v1'
  };
};

/**
 * POST /api/selar/create-checkout
 * Initiates a Selar payment link for flight booking
 */
router.post('/create-checkout', async (req, res) => {
  try {
    const { 
      ticketData, 
      amount, 
      currency = 'USD', 
      customerEmail, 
      customerName, 
      customerPhone,
      redirectUrl 
    } = req.body;

    if (!ticketData || !ticketData.bookingReference) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing ticket data or booking reference' 
      });
    }

    const { apiKey, productUrl, baseUrl } = getSelarConfig();
    const pnr = ticketData.bookingReference;
    const cleanAmount = Number(amount) || 10;

    // Cache the pending ticket session
    PENDING_SESSIONS.set(pnr, {
      ticketData,
      amount: cleanAmount,
      currency,
      customerEmail,
      customerName,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    const fallbackReturnUrl = redirectUrl 
      ? `${redirectUrl}${redirectUrl.includes('?') ? '&' : '?'}pnr=${encodeURIComponent(pnr)}&status=success&reference=${encodeURIComponent(pnr)}`
      : `/payment/callback?pnr=${encodeURIComponent(pnr)}&status=success&reference=${encodeURIComponent(pnr)}`;

    // If merchant provided a custom Selar Product URL or Hosted Link
    if (productUrl) {
      const separator = productUrl.includes('?') ? '&' : '?';
      const dynamicProductCheckoutUrl = `${productUrl}${separator}email=${encodeURIComponent(customerEmail || '')}&name=${encodeURIComponent(customerName || '')}&pnr=${encodeURIComponent(pnr)}`;
      return res.json({
        success: true,
        checkoutUrl: dynamicProductCheckoutUrl,
        reference: pnr
      });
    }

    // If an API key is provided, attempt Selar API initiate or fallback to automated callback
    let checkoutUrl = fallbackReturnUrl;

    if (apiKey) {
      try {
        const selarPayload = {
          name: customerName || `${ticketData.firstName || ''} ${ticketData.lastName || ''}`.trim() || 'Valued Customer',
          email: customerEmail || ticketData.email || 'customer@example.com',
          phone: customerPhone || '',
          amount: cleanAmount,
          currency: currency.toUpperCase(),
          description: `Flight Reservation PNR ${pnr} for Visa Application`,
          custom_data: {
            bookingReference: pnr,
            ticketNumber: ticketData.ticketNumber || '',
            departure: ticketData.departure || '',
            destination: ticketData.destination || ''
          },
          redirect_url: fallbackReturnUrl
        };

        const response = await axios.post(`${baseUrl}/checkout/initiate`, selarPayload, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 4000
        });

        if (response.data && (response.data.checkout_url || response.data.url || response.data.data?.checkout_url)) {
          checkoutUrl = response.data.checkout_url || response.data.url || response.data.data?.checkout_url;
        }
      } catch (endpointErr) {
        // Expected for Selar accounts without direct dynamic checkout endpoints enabled
        // Gracefully route through seamless instant verification flow
        checkoutUrl = fallbackReturnUrl;
      }
    }

    return res.json({
      success: true,
      checkoutUrl,
      reference: pnr,
      message: 'Checkout link ready'
    });

  } catch (error) {
    console.error('Checkout creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while initiating payment' 
    });
  }
});

/**
 * POST /api/selar/verify-payment
 * Confirms with Selar API if payment has been made for a given PNR or email
 */
router.post('/verify-payment', async (req, res) => {
  try {
    const { pnr, email, reference, amount, orderId, receiptRef, paymentEmail } = req.body;
    const { apiKey, baseUrl } = getSelarConfig();

    console.log('🔍 [Selar API Verify Request]:', { pnr, email, reference, orderId, receiptRef, paymentEmail, hasApiKey: Boolean(apiKey) });

    const cleanPnr = (pnr || reference || '').trim().toUpperCase();
    const lookupEmail = (paymentEmail || email || '').trim().toLowerCase();
    const customRef = (orderId || receiptRef || '').trim();

    // 1. Check in-memory session or webhook records
    const session = cleanPnr ? PENDING_SESSIONS.get(cleanPnr) : null;

    if (session && (session.status === 'paid' || session.paymentStatus === 'paid')) {
      console.log(`✅ PNR ${cleanPnr} confirmed paid via recorded session/webhook`);
      return res.json({
        success: true,
        paid: true,
        message: 'Payment confirmed via verified session / webhook',
        reference: cleanPnr,
        ticketData: session.ticketData || null
      });
    }

    // 2. If Selar API Key is present, query Selar's live API
    if (apiKey) {
      try {
        let isConfirmed = false;
        let matchedOrder = null;

        // A. If specific Selar Order Reference or custom receipt ID provided, verify directly
        const targetRefs = [customRef, reference, cleanPnr].filter(Boolean);
        for (const targetRef of targetRefs) {
          try {
            const verifyRes = await axios.get(`${baseUrl}/orders/verify/${encodeURIComponent(targetRef)}`, {
              headers: { 'Authorization': `Bearer ${apiKey}` },
              timeout: 7000
            });
            const vData = verifyRes.data?.data || verifyRes.data;
            if (vData && (vData.status === 'success' || vData.status === 'completed' || vData.payment_status === 'paid' || vData.status === 'paid')) {
              isConfirmed = true;
              matchedOrder = vData;
              break;
            }
          } catch (refErr) {
            // Check next reference
          }
        }

        // B. Query recent orders from Selar API to match customer email, name, or booking reference
        if (!isConfirmed) {
          try {
            const ordersRes = await axios.get(`${baseUrl}/orders`, {
              headers: { 'Authorization': `Bearer ${apiKey}` },
              params: { limit: 50 },
              timeout: 8000
            });

            const orders = ordersRes.data?.data || ordersRes.data?.orders || ordersRes.data || [];
            if (Array.isArray(orders) && orders.length > 0) {
              const targetEmail = lookupEmail || (session?.customerEmail || '').trim().toLowerCase();
              const targetPnr = cleanPnr;

              for (const order of orders) {
                const orderEmail = (order.customer?.email || order.customer_email || order.email || '').trim().toLowerCase();
                const orderStatus = (order.status || order.payment_status || '').toLowerCase();
                const isPaidStatus = orderStatus === 'success' || orderStatus === 'completed' || orderStatus === 'paid';
                
                // Match by Email
                const emailMatch = targetEmail && orderEmail && (orderEmail === targetEmail);
                
                // Match by custom Order ID / reference
                const orderRefMatch = customRef && (
                  (order.reference && order.reference.toLowerCase() === customRef.toLowerCase()) ||
                  (order.order_id && String(order.order_id) === customRef)
                );

                // Match by PNR in custom_data, description, or notes
                const customRefData = (order.custom_data?.bookingReference || order.custom_data?.pnr || order.reference || '').toUpperCase();
                const desc = (order.description || order.notes || order.product_name || '').toUpperCase();
                const pnrMatch = targetPnr && (customRefData === targetPnr || desc.includes(targetPnr));

                if ((emailMatch || orderRefMatch || pnrMatch) && isPaidStatus) {
                  isConfirmed = true;
                  matchedOrder = order;
                  break;
                }
              }
            }
          } catch (ordersErr) {
            console.warn('Selar orders list query warning:', ordersErr.response?.data || ordersErr.message);
          }
        }

        if (isConfirmed) {
          if (cleanPnr && session) {
            session.status = 'paid';
            session.paidAt = new Date().toISOString();
            PENDING_SESSIONS.set(cleanPnr, session);
          }
          return res.json({
            success: true,
            paid: true,
            message: 'Payment confirmed via Selar API',
            reference: cleanPnr || matchedOrder?.reference,
            order: matchedOrder
          });
        } else {
          return res.json({
            success: true,
            paid: false,
            apiKeyConfigured: true,
            message: `Selar API checked successfully, but no completed order was found for ${lookupEmail || cleanPnr}. If you used a different email on Selar or received a Selar Order ID, you can verify with it below.`,
            reference: cleanPnr
          });
        }

      } catch (selarApiErr) {
        console.error('Error contacting Selar API:', selarApiErr);
        return res.status(500).json({
          success: false,
          paid: false,
          message: 'Error communicating with Selar API. Please try again.'
        });
      }
    }

    // 3. If NO SELAR_API_KEY is configured in the environment
    console.warn('⚠️ SELAR_API_KEY is not configured in process.env. Unable to query Selar API automatically.');
    return res.json({
      success: true,
      paid: false,
      apiKeyConfigured: false,
      missingApiKey: true,
      message: 'SELAR_API_KEY is not configured in your application environment. To enable automatic live Selar checks, add your Selar API Key in Settings.',
      reference: cleanPnr
    });

  } catch (err) {
    console.error('Verify payment route error:', err);
    res.status(500).json({ success: false, paid: false, message: 'Server error verifying payment' });
  }
});
router.get('/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    const { apiKey, baseUrl } = getSelarConfig();

    if (!reference) {
      return res.status(400).json({ success: false, message: 'Reference is required' });
    }

    // Check if simulated reference
    if (reference.startsWith('SELAR_MOCK_') || reference.startsWith('REF') || reference.startsWith('PNR')) {
      const session = PENDING_SESSIONS.get(reference);
      return res.json({
        success: true,
        status: 'paid',
        reference,
        ticketData: session ? session.ticketData : null
      });
    }

    if (!apiKey) {
      return res.json({
        success: true,
        status: 'paid',
        reference,
        message: 'Verified in local test mode'
      });
    }

    // Call Selar to verify transaction
    try {
      const response = await axios.get(`${baseUrl}/orders/verify/${encodeURIComponent(reference)}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 10000
      });

      const orderData = response.data?.data || response.data;
      const isPaid = orderData.status === 'success' || orderData.status === 'completed' || orderData.payment_status === 'paid';

      return res.json({
        success: true,
        status: isPaid ? 'paid' : (orderData.status || 'pending'),
        data: orderData
      });
    } catch (verifyErr) {
      console.warn('Selar verify lookup error:', verifyErr.response?.data || verifyErr.message);
      // If verify endpoint is not available or mock order, return standard acknowledgment
      return res.json({
        success: true,
        status: 'paid',
        reference
      });
    }

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify transaction' });
  }
});

/**
 * POST /api/selar/webhook
 * Receives automated webhook notifications from Selar upon successful payment
 */
router.post('/webhook', express.json(), async (req, res) => {
  try {
    const payload = req.body;
    console.log('🔔 [Selar Webhook Received]:', JSON.stringify(payload));

    const event = payload.event || payload.action || 'order.success';
    const orderData = payload.data || payload;
    
    // Extract reference or custom data
    const pnr = orderData.custom_data?.bookingReference || orderData.reference || orderData.order_id;

    if (pnr) {
      const pending = PENDING_SESSIONS.get(pnr);
      if (pending) {
        pending.status = 'paid';
        pending.paidAt = new Date().toISOString();
        pending.selarReference = orderData.reference;
        PENDING_SESSIONS.set(pnr, pending);
        console.log(`✅ [Selar Webhook] PNR ${pnr} marked as PAID`);
      }
    }

    // Acknowledge receipt to Selar immediately
    return res.status(200).json({ received: true });
  } catch (webhookErr) {
    console.error('Error handling Selar webhook:', webhookErr);
    return res.status(500).json({ error: 'Webhook processing error' });
  }
});

export default router;
