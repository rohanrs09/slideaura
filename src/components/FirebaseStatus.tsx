import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

function FirebaseStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Simple online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null; // Don't show anything when online
  }

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm">
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-center gap-3">
        <WifiOff className="h-4 w-4 text-yellow-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-xs text-yellow-500 font-medium">Connection Issue</p>
          <p className="text-xs text-yellow-600/70">
            You're offline - some features may be limited
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="text-xs text-yellow-500 hover:text-yellow-400"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export default FirebaseStatus;
