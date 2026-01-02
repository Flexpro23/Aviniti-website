'use client';

import { useEffect } from 'react';

export default function ServiceWorkerUnregister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
          console.log('Unregistering service worker:', registration);
          registration.unregister();
        }
      });
    }
  }, []);

  return null;
}
