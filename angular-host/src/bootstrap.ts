import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Initialize the federation
declare const __webpack_init_sharing__: Function;
declare const __webpack_share_scopes__: { default: any };

const initSharing = async () => {
  try {
    await __webpack_init_sharing__('default');
    const container = (window as any).reactDashboard;
    if (container) {
      await container.init(__webpack_share_scopes__.default);
    }
  } catch (err) {
    console.warn('Federation initialization error:', err);
  }
};

// Bootstrap the application after initializing the federation
initSharing().then(() => {
  bootstrapApplication(AppComponent, appConfig).catch((err) =>
    console.error('Application bootstrap error:', err)
  );
});
