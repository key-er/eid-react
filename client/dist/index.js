    // registering service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js') //client/dist is already set in webpack config
      .then(function() {
        console.log('Service Worker Registered!')
      })
    }