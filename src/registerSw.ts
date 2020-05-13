export async function registerSw() {
  const { Workbox } = await import('workbox-window');

  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/service-worker.js');
    wb.register();
  }
}
