export async function registerSw() {
  const { Workbox, messageSW } = await import('workbox-window');

  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');

    let registration: ServiceWorkerRegistration | undefined;

    const handleSwEv = (event: any) => {
      console.log('event?', event);

      const prompt = window.prompt('Updates!! Click ok to reload?');

      if (prompt) {
        // Assuming the user accepted the update, set up a listener
        // that will reload the page as soon as the previously waiting
        // service worker has taken control.
        wb.addEventListener('controlling', (event) => {
          window.location.reload();
        });
      }

      if (registration && registration.waiting) {
        // Send a message to the waiting service worker,
        // instructing it to activate.
        // Note: for this to work, you have to add a message
        // listener in your service worker. See below.
        messageSW(registration.waiting, { type: 'SKIP_WAITING' });
      }
    };
    wb.addEventListener('waiting', handleSwEv);
    wb.addEventListener('externalwaiting', handleSwEv);
    registration = await wb.register();
  }
}
