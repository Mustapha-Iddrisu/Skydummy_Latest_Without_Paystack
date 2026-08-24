// src/components/booking/RouteSelection.jsx
import React from 'react';
import { 
  Route as RouteIcon, 
  PlaneTakeoff, 
  PlaneLanding, 
  Plane, 
  Loader2, 
  MousePointer, 
  Ticket, 
  ArrowRightLeft, 
  Armchair, 
  CheckCircle, 
  Plus, 
  AlertTriangle, 
  AlertCircle,
  Clock
} from 'lucide-react';

const RouteSelection = ({
  availableRoutes,
  selectedRoute,
  onSelectRoute,
  isLoadingRoutes,
  departure,
  destination,
  departDate,
  returnDate,
  tripType,
  hasError
}) => {
  const isFormReady = departure && destination && departDate && (tripType !== 'round' || returnDate);

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getTransitText = (flight) => {
    if (!flight) return '';
    if (flight.stops > 0 && flight.stopoverDetails) {
      const hrs = Math.floor(flight.stopoverDetails.duration / 60);
      const mins = flight.stopoverDetails.duration % 60;
      const durationStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
      return `Layover: ${flight.stopoverDetails.airport || flight.stopoverDetails.city} • ${durationStr}`;
    }
    return `Non-stop direct flight`;
  };

  return (
    <div className={`route-selection-wrapper ${hasError ? 'route-selection-error' : ''}`} id="route-selection-section">
      <div className="section-title">
        <RouteIcon size={16} /> <span>Select Flight Route</span>
        <span className="route-badge">Verified Flights</span>
      </div>

      {!isFormReady ? (
        <div className="route-prompt-card">
          <PlaneTakeoff size={28} className="prompt-icon" color="#2a7de1" />
          <p>Select your <strong>Departure</strong>, <strong>Destination</strong>, and <strong>Date</strong> above to load live route options.</p>
        </div>
      ) : isLoadingRoutes ? (
        <div className="route-loading-card">
          <Loader2 size={24} className="animate-spin loading-icon" color="#2a7de1" />
          <p>Searching flights for <strong>{departure} ➔ {destination}</strong>...</p>
        </div>
      ) : availableRoutes && availableRoutes.length > 0 ? (
        <div className="route-options-container">
          <p className="route-instructions">
            <MousePointer size={13} /> <span>Choose one of the {availableRoutes.length} available flight schedule options:</span>
          </p>

          <div className="route-cards-list">
            {availableRoutes.map((route, index) => {
              const isSelected = selectedRoute && selectedRoute.id === route.id;
              const depFlight = route.departure;
              const retFlight = route.return;

              const depTransitText = getTransitText(depFlight);
              const retTransitText = getTransitText(retFlight);

              return (
                <div
                  key={route.id || index}
                  className={`route-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectRoute(route)}
                >
                  {/* Top Bar: Airline info & Flight number */}
                  <div className="route-card-header">
                    <div className="airline-info">
                      <span className="airline-code-badge">{depFlight.airline?.code || 'FL'}</span>
                      <div className="airline-meta">
                        <span className="airline-name">{depFlight.airline?.name || 'Commercial Airline'}</span>
                        {depFlight.airline?.alliance && (
                          <span className="alliance-tag hide-on-mobile">{depFlight.airline.alliance}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flight-number-tag">
                      <Ticket size={12} /> <span>{depFlight.flightNumber}</span>
                    </div>
                  </div>

                  {/* Outbound Segment */}
                  <div className="route-segment">
                    <div className="segment-label">
                      <PlaneTakeoff size={12} color="#2563eb" /> 
                      <span>Outbound • {formatDate(depFlight.departure?.time)}</span>
                    </div>

                    <div className="segment-details">
                      <div className="time-block">
                        <span className="time">{formatTime(depFlight.departure?.time)}</span>
                        <span className="airport">{depFlight.departure?.airport}</span>
                      </div>

                      <div className="flight-path">
                        <span className="duration">
                          <Clock size={10} /> {depFlight.durationFormatted}
                        </span>
                        <div className="path-line">
                          <span className="dot"></span>
                          <span className="line"></span>
                          <Plane size={11} className="plane-icon" />
                          <span className="line"></span>
                          <span className="dot"></span>
                        </div>
                        <span className={`stops-badge ${depFlight.stops === 0 ? 'direct' : 'connecting'}`}>
                          {depFlight.stops === 0 ? 'Direct' : `${depFlight.stops} Stop (${depFlight.stopoverDetails?.airport || 'Hub'})`}
                        </span>
                      </div>

                      <div className="time-block right">
                        <span className="time">{formatTime(depFlight.arrival?.time)}</span>
                        <span className="airport">{depFlight.arrival?.airport}</span>
                      </div>
                    </div>

                    {/* Transit Info Strip - Direct is hidden on mobile to conserve space */}
                    {depFlight.stops > 0 ? (
                      <div className="transit-info-strip">
                        <ArrowRightLeft size={11} /> <span>{depTransitText}</span>
                      </div>
                    ) : (
                      <div className="transit-info-strip transit-strip-direct hide-on-mobile">
                        <ArrowRightLeft size={11} /> <span>{depTransitText}</span>
                      </div>
                    )}
                  </div>

                  {/* Return Segment if Round Trip */}
                  {tripType === 'round' && retFlight && (
                    <div className="route-segment return-segment">
                      <div className="segment-label">
                        <PlaneLanding size={12} color="#059669" /> 
                        <span>Return • {formatDate(retFlight.departure?.time)}</span>
                      </div>

                      <div className="segment-details">
                        <div className="time-block">
                          <span className="time">{formatTime(retFlight.departure?.time)}</span>
                          <span className="airport">{retFlight.departure?.airport}</span>
                        </div>

                        <div className="flight-path">
                          <span className="duration">
                            <Clock size={10} /> {retFlight.durationFormatted}
                          </span>
                          <div className="path-line">
                            <span className="dot"></span>
                            <span className="line"></span>
                            <Plane size={11} className="plane-icon reverse" />
                            <span className="line"></span>
                            <span className="dot"></span>
                          </div>
                          <span className={`stops-badge ${retFlight.stops === 0 ? 'direct' : 'connecting'}`}>
                            {retFlight.stops === 0 ? 'Direct' : `${retFlight.stops} Stop (${retFlight.stopoverDetails?.airport || 'Hub'})`}
                          </span>
                        </div>

                        <div className="time-block right">
                          <span className="time">{formatTime(retFlight.arrival?.time)}</span>
                          <span className="airport">{retFlight.arrival?.airport}</span>
                        </div>
                      </div>

                      {/* Transit Info Strip - Direct is hidden on mobile to conserve space */}
                      {retFlight.stops > 0 ? (
                        <div className="transit-info-strip">
                          <ArrowRightLeft size={11} /> <span>{retTransitText}</span>
                        </div>
                      ) : (
                        <div className="transit-info-strip transit-strip-direct hide-on-mobile">
                          <ArrowRightLeft size={11} /> <span>{retTransitText}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Route Card Footer */}
                  <div className="route-card-footer">
                    <div className="aircraft-info">
                      <span className="aircraft-model hide-on-mobile"><Plane size={11} /> {depFlight.aircraft || 'Commercial Jet'}</span>
                      <span><Armchair size={11} /> {depFlight.bookingClass || 'Economy'}</span>
                    </div>

                    <button
                      type="button"
                      className={`select-route-btn ${isSelected ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRoute(route);
                      }}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle size={13} /> <span>Selected</span>
                        </>
                      ) : (
                        <>
                          <Plus size={13} /> <span>Select</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="route-prompt-card">
          <AlertTriangle size={28} className="warning-icon" color="#e67e22" />
          <p>No direct routes found for this airport combination. Please try major international hubs.</p>
        </div>
      )}

      {hasError && (
        <div className="route-error-msg">
          <AlertCircle size={14} /> <span>Please select one of the flight routes above to proceed.</span>
        </div>
      )}
    </div>
  );
};

export default RouteSelection;
