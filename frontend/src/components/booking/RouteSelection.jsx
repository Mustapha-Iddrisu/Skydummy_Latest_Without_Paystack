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
  Info, 
  ArrowRightLeft, 
  Armchair, 
  CheckCircle, 
  Plus, 
  AlertTriangle, 
  AlertCircle 
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
      return `Transit Stop: ${flight.stopoverDetails.city}, ${flight.stopoverDetails.country} (${flight.stopoverDetails.airport}) — Layover: ${durationStr}`;
    }
    return `Transit: Direct Non-stop flight from ${flight.departure?.city || flight.departure?.airport} to ${flight.arrival?.city || flight.arrival?.airport}`;
  };

  return (
    <div className={`route-selection-wrapper ${hasError ? 'route-selection-error' : ''}`} id="route-selection-section">
      <div className="section-title">
        <RouteIcon size={18} /> <span>Select Flight Route</span>
        <span className="route-badge">World Flight Data</span>
      </div>

      {!isFormReady ? (
        <div className="route-prompt-card">
          <PlaneTakeoff size={36} className="prompt-icon" color="#2a7de1" />
          <p>Please select your <strong>Departure Airport</strong>, <strong>Destination Airport</strong>, and <strong>Date(s)</strong> above to view available routes.</p>
        </div>
      ) : isLoadingRoutes ? (
        <div className="route-loading-card">
          <Loader2 size={32} className="animate-spin loading-icon" color="#2a7de1" />
          <p>Searching world flight database for <strong>{departure} ➔ {destination}</strong>...</p>
        </div>
      ) : availableRoutes && availableRoutes.length > 0 ? (
        <div className="route-options-container">
          <p className="route-instructions" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MousePointer size={14} /> <span>Select one of the {availableRoutes.length} available flight routes below (hover over any route to inspect transit/stop details):</span>
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
                  <div className="route-card-header">
                    <div className="airline-info">
                      <span className="airline-code-badge">{depFlight.airline.code}</span>
                      <div className="airline-meta">
                        <span className="airline-name">{depFlight.airline.name}</span>
                        <span className="alliance-tag">{depFlight.airline.alliance}</span>
                      </div>
                    </div>
                    <div className="flight-number-tag" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Ticket size={13} /> <span>{depFlight.flightNumber}</span>
                    </div>
                  </div>

                  {/* Outbound Segment */}
                  <div className="route-segment">
                    <div className="segment-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <PlaneTakeoff size={14} /> <span>Outbound ({formatDate(depFlight.departure.time)})</span>
                    </div>
                    <div className="segment-details">
                      <div className="time-block">
                        <span className="time">{formatTime(depFlight.departure.time)}</span>
                        <span className="airport">{depFlight.departure.airport}</span>
                      </div>

                      <div className="flight-path" title={depTransitText}>
                        <span className="duration">{depFlight.durationFormatted}</span>
                        <div className="path-line">
                          <span className="dot"></span>
                          <span className="line"></span>
                          <Plane size={14} className="plane-icon" />
                          <span className="line"></span>
                          <span className="dot"></span>
                        </div>
                        <div className="stops-badge-container">
                          <span className={`stops-badge ${depFlight.stops === 0 ? 'direct' : 'connecting'}`}>
                            {depFlight.stops === 0 ? 'Direct Flight' : `${depFlight.stops} Stop (${depFlight.stopoverDetails?.airport || 'Hub'})`}
                          </span>
                          <div className="transit-tooltip">
                            <Info size={12} /> {depTransitText}
                          </div>
                        </div>
                      </div>

                      <div className="time-block right">
                        <span className="time">{formatTime(depFlight.arrival.time)}</span>
                        <span className="airport">{depFlight.arrival.airport}</span>
                      </div>
                    </div>

                    {/* Transit Detail Strip on Hover */}
                    <div className="transit-info-strip">
                      <ArrowRightLeft size={13} /> <span>{depTransitText}</span>
                    </div>
                  </div>

                  {/* Return Segment if Round Trip */}
                  {tripType === 'round' && retFlight && (
                    <div className="route-segment return-segment">
                      <div className="segment-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <PlaneLanding size={14} /> <span>Return ({formatDate(retFlight.departure.time)})</span>
                      </div>
                      <div className="segment-details">
                        <div className="time-block">
                          <span className="time">{formatTime(retFlight.departure.time)}</span>
                          <span className="airport">{retFlight.departure.airport}</span>
                        </div>

                        <div className="flight-path" title={retTransitText}>
                          <span className="duration">{retFlight.durationFormatted}</span>
                          <div className="path-line">
                            <span className="dot"></span>
                            <span className="line"></span>
                            <Plane size={14} className="plane-icon reverse" />
                            <span className="line"></span>
                            <span className="dot"></span>
                          </div>
                          <div className="stops-badge-container">
                            <span className={`stops-badge ${retFlight.stops === 0 ? 'direct' : 'connecting'}`}>
                              {retFlight.stops === 0 ? 'Direct Flight' : `${retFlight.stops} Stop (${retFlight.stopoverDetails?.airport || 'Hub'})`}
                            </span>
                            <div className="transit-tooltip">
                              <Info size={12} /> {retTransitText}
                            </div>
                          </div>
                        </div>

                        <div className="time-block right">
                          <span className="time">{formatTime(retFlight.arrival.time)}</span>
                          <span className="airport">{retFlight.arrival.airport}</span>
                        </div>
                      </div>

                      {/* Transit Detail Strip on Hover */}
                      <div className="transit-info-strip">
                        <ArrowRightLeft size={13} /> <span>{retTransitText}</span>
                      </div>
                    </div>
                  )}

                  {/* Route Card Footer */}
                  <div className="route-card-footer">
                    <div className="aircraft-info" style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Plane size={13} /> {depFlight.aircraft}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Armchair size={13} /> {depFlight.bookingClass}</span>
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
                          <CheckCircle size={14} /> <span>Selected</span>
                        </>
                      ) : (
                        <>
                          <Plus size={14} /> <span>Select Route</span>
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
          <AlertTriangle size={36} className="warning-icon" color="#e67e22" />
          <p>No available routes found for the selected airport pair. Try picking major international airports.</p>
        </div>
      )}

      {hasError && (
        <div className="route-error-msg" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertCircle size={15} /> <span>Please select one of the flight routes above to proceed with your ticket booking.</span>
        </div>
      )}
    </div>
  );
};

export default RouteSelection;

