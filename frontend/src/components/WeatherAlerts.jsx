import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Zap, Wind, Sun, CloudRain, Snowflake, ChevronDown, ChevronUp, X, BellRing, Info } from 'lucide-react';

export const WeatherAlerts = ({ alerts = [], city = '' }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [dismissedIds, setDismissedIds] = useState([]);

  const activeAlerts = alerts.filter(a => !dismissedIds.includes(a.id));

  if (!activeAlerts || activeAlerts.length === 0) {
    return (
      <div className="weather-alert-card clear-status-card">
        <div className="alert-header-row">
          <div className="alert-title-group">
            <div className="status-dot green-dot pulse-glow" />
            <BellRing className="alert-icon green-text" size={20} />
            <span className="alert-main-title">Weather Status Normal</span>
            <span className="alert-tag clear-tag">All Clear</span>
          </div>
          <span className="alert-time">No Severe Advisories for {city || 'your area'}</span>
        </div>
      </div>
    );
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'zap': return <Zap size={22} className="alert-icon" />;
      case 'wind': return <Wind size={22} className="alert-icon" />;
      case 'sun': return <Sun size={22} className="alert-icon" />;
      case 'cloud-rain': return <CloudRain size={22} className="alert-icon" />;
      case 'snowflake': return <Snowflake size={22} className="alert-icon" />;
      default: return <ShieldAlert size={22} className="alert-icon" />;
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleDismiss = (id, e) => {
    e.stopPropagation();
    setDismissedIds(prev => [...prev, id]);
  };

  return (
    <div className="weather-alerts-container">
      {activeAlerts.map((alert) => {
        const isExpanded = expandedId === alert.id;
        const severityClass = `severity-${alert.severity || 'warning'}`;

        return (
          <div
            key={alert.id}
            className={`weather-alert-card ${severityClass} ${isExpanded ? 'is-expanded' : ''}`}
            onClick={() => toggleExpand(alert.id)}
          >
            <div className="alert-header-row">
              <div className="alert-title-group">
                <div className="status-dot pulse-glow" style={{ backgroundColor: alert.color }} />
                <span style={{ color: alert.color }}>
                  {getAlertIcon(alert.icon)}
                </span>
                <div className="alert-text-wrapper">
                  <div className="alert-badge-row">
                    <span className="alert-severity-badge" style={{ backgroundColor: alert.color }}>
                      {(alert.severity || 'WARNING').toUpperCase()}
                    </span>
                    <span className="alert-event-tag">{alert.event || 'Severe Weather'}</span>
                  </div>
                  <h4 className="alert-main-title">{alert.title}</h4>
                </div>
              </div>

              <div className="alert-actions-group">
                <span className="alert-time">{alert.time}</span>
                <button
                  className="alert-expand-btn"
                  aria-label="Toggle Alert Details"
                >
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                <button
                  className="alert-dismiss-btn"
                  onClick={(e) => handleDismiss(alert.id, e)}
                  aria-label="Dismiss Alert"
                  title="Dismiss warning"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <p className="alert-description">{alert.description}</p>

            {isExpanded && alert.instruction && (
              <div className="alert-expanded-details">
                <div className="instruction-header">
                  <Info size={16} />
                  <span>Safety Action & Advice:</span>
                </div>
                <p className="instruction-text">{alert.instruction}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WeatherAlerts;
