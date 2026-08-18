import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import firebaseConfig from '../../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Handle named database ID if present, otherwise default
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

export function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

// Deep clean object to completely eliminate circular references, DOM elements, React Fiber nodes, and functions
export const deepCleanObject = (obj, seen = new WeakSet()) => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') {
    if (typeof obj === 'function' || typeof obj === 'symbol') return undefined;
    return obj;
  }

  // Guard against DOM elements, Window, and React Fiber/SyntheticEvent references
  if (
    (typeof HTMLElement !== 'undefined' && obj instanceof HTMLElement) ||
    (typeof Element !== 'undefined' && obj instanceof Element) ||
    (typeof Node !== 'undefined' && obj instanceof Node) ||
    (typeof Window !== 'undefined' && obj instanceof Window) ||
    obj.nodeType !== undefined ||
    obj.stateNode !== undefined ||
    obj._reactFiber !== undefined ||
    (obj.target !== undefined && obj.nativeEvent !== undefined)
  ) {
    return undefined;
  }

  // Prevent circular traversal
  if (seen.has(obj)) {
    return undefined;
  }
  seen.add(obj);

  // Arrays
  if (Array.isArray(obj)) {
    return obj
      .map(item => deepCleanObject(item, seen))
      .filter(item => item !== undefined);
  }

  // Plain objects
  const clean = {};
  for (const key of Object.keys(obj)) {
    if (
      key.startsWith('__react') || 
      key.startsWith('_react') || 
      key === 'stateNode' ||
      key === 'target' ||
      key === 'nativeEvent'
    ) {
      continue;
    }
    const val = deepCleanObject(obj[key], seen);
    if (val !== undefined) {
      clean[key] = val;
    }
  }
  return clean;
};

/**
 * Save ticket directly to Firestore database for worldwide real-time verification across any device
 * Automatically embeds 14-day validity window and expiry timestamps
 */
export const saveTicketToFirestore = async (ticketData) => {
  if (!ticketData || !ticketData.bookingReference) return false;
  
  const pnr = String(ticketData.bookingReference || '').trim().toUpperCase();
  if (!pnr) return false;
  const docPath = `tickets/${pnr}`;

  try {
    const cleanData = deepCleanObject(ticketData) || {};
    const docRef = doc(db, 'tickets', pnr);

    const now = new Date();
    const issueDate = cleanData.issueDate || now.toISOString().split('T')[0];
    const createdAt = cleanData.createdAt || now.toISOString();

    // 14 days validity calculation
    const VALIDITY_DAYS = 14;
    const createdTime = new Date(createdAt).getTime() || now.getTime();
    const expiresAtDate = new Date(createdTime + VALIDITY_DAYS * 24 * 60 * 60 * 1000);
    const expiresAt = cleanData.expiresAt || expiresAtDate.toISOString();
    const expiryDate = cleanData.expiryDate || expiresAtDate.toISOString().split('T')[0];

    const isExpired = Date.now() > new Date(expiresAt).getTime();
    const computedStatus = isExpired ? 'expired' : (cleanData.status || 'confirmed');

    const payload = {
      ...cleanData,
      bookingReference: pnr,
      pnrClean: pnr.replace(/[^A-Z0-9]/gi, '').toUpperCase(),
      lastNameLower: String(cleanData.lastName || '').trim().toLowerCase(),
      createdAt,
      issueDate,
      validityDays: VALIDITY_DAYS,
      expiryDate,
      expiresAt,
      status: computedStatus,
      updatedAt: now.toISOString()
    };

    await setDoc(docRef, payload, { merge: true });
    console.log(`[Firestore] Successfully saved ticket ${pnr} with 14-day expiry (${expiryDate}) to cloud database`);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
    return false;
  }
};

/**
 * Enriches a ticket object with live expiry status check
 */
export const checkTicketExpiry = (ticket) => {
  if (!ticket) return null;
  const now = Date.now();
  
  let expiresAtMs = null;
  if (ticket.expiresAt) {
    expiresAtMs = new Date(ticket.expiresAt).getTime();
  } else if (ticket.expiryDate) {
    expiresAtMs = new Date(ticket.expiryDate).getTime() + (24 * 60 * 60 * 1000 - 1);
  } else if (ticket.createdAt || ticket.issueDate) {
    const baseMs = new Date(ticket.createdAt || ticket.issueDate).getTime();
    expiresAtMs = baseMs + 14 * 24 * 60 * 60 * 1000;
  }

  const isExpired = expiresAtMs ? now > expiresAtMs : false;
  const expiryDate = ticket.expiryDate || (expiresAtMs ? new Date(expiresAtMs).toISOString().split('T')[0] : null);

  return {
    ...ticket,
    isExpired,
    expiryDate,
    expiresAt: ticket.expiresAt || (expiresAtMs ? new Date(expiresAtMs).toISOString() : null),
    validityDays: ticket.validityDays || 14,
    status: isExpired ? 'expired' : (ticket.status || 'confirmed')
  };
};

/**
 * Search ticket from Firestore cloud database
 */
export const searchTicketInFirestore = async (pnrInput, lastNameInput = '') => {
  if (!pnrInput) return null;

  const queryRef = String(pnrInput).trim().toUpperCase();
  const cleanRef = queryRef.replace(/[^A-Z0-9]/gi, '');
  const queryName = lastNameInput ? String(lastNameInput).trim().toLowerCase() : '';
  const docPath = `tickets/${queryRef}`;

  try {
    // 1. Try direct lookup by PNR document ID
    const directDocRef = doc(db, 'tickets', queryRef);
    const directSnap = await getDoc(directDocRef);

    if (directSnap.exists()) {
      const ticket = directSnap.data();
      if (matchesLastName(ticket, queryName)) {
        console.log('[Firestore] Match found via direct document key');
        return checkTicketExpiry(ticket);
      }
    }

    // 2. Query by bookingReference or pnrClean or ticketNumber
    const ticketsRef = collection(db, 'tickets');
    
    // Check cleanRef
    const qClean = query(ticketsRef, where('pnrClean', '==', cleanRef));
    const cleanSnap = await getDocs(qClean);
    for (const d of cleanSnap.docs) {
      const ticket = d.data();
      if (matchesLastName(ticket, queryName)) {
        return checkTicketExpiry(ticket);
      }
    }

    // Check ticketNumber
    const qTicketNo = query(ticketsRef, where('ticketNumber', '==', queryRef));
    const ticketNoSnap = await getDocs(qTicketNo);
    for (const d of ticketNoSnap.docs) {
      const ticket = d.data();
      if (matchesLastName(ticket, queryName)) {
        return checkTicketExpiry(ticket);
      }
    }

    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
    return null;
  }
};

const matchesLastName = (ticket, queryName) => {
  if (!queryName) return true;
  const mainLast = String(ticket.lastName || '').toLowerCase();
  const listMatch = Array.isArray(ticket.passengerList) && ticket.passengerList.some(p => String(p?.lastName || '').toLowerCase().includes(queryName));
  return mainLast.includes(queryName) || listMatch;
};
