import React from 'react';
import { AlertCircle, RotateCcw, MapPinOff, WifiOff } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  // Determine icon based on message content
  const isLocationError = message.toLowerCase().includes('location');
  const isNetworkError = message.toLowerCase().includes('internet') || message.toLowerCase().includes('connection');

  return (
    <div className="error-banner" role="alert">
      <div className="error-icon">
        {isLocationError ? (
          <MapPinOff size={24} />
        ) : isNetworkError ? (
          <WifiOff size={24} />
        ) : (
          <AlertCircle size={24} />
        )}
      </div>

      <h3 className="error-title">
        {isLocationError
          ? 'Location Access Notice'
          : isNetworkError
          ? 'Network Disruption'
          : 'Unable to Retrieve Weather'}
      </h3>

      <p className="error-desc">{message}</p>

      {onRetry && (
        <button type="button" className="retry-btn" onClick={onRetry}>
          <RotateCcw size={16} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
