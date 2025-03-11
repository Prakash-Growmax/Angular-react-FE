import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

// Add these declarations for webpack federation
declare const __webpack_init_sharing__: (shareScope: string) => Promise<void>;
declare const __webpack_share_scopes__: { default: Scope };
type Scope = unknown;

@Component({
  selector: 'app-dashboard-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wrapper">
      <h2>Angular-Hosted React Dashboard</h2>
      <div #reactContainer></div>
      <div *ngIf="error" class="error-message">
        <p>Error loading React Dashboard: {{ error }}</p>
      </div>
      <div *ngIf="loading">Loading React Dashboard...</div>
    </div>
  `,
  styles: [
    `
      .wrapper {
        padding: 20px;
        border: 1px solid #eee;
        border-radius: 4px;
      }
      .error-message {
        color: red;
        padding: 10px;
        border: 1px solid red;
        border-radius: 4px;
        margin-top: 10px;
      }
    `,
  ],
})
export class DashboardWrapperComponent implements OnInit, OnDestroy {
  @ViewChild('reactContainer', { static: true }) containerRef!: ElementRef;
  private reactRoot: any = null;
  error: string | null = null;
  loading: boolean = true;

  constructor() {}

  // Initialize the shared scope for webpack module federation
  private async initSharing() {
    try {
      await __webpack_init_sharing__('default');
      return true;
    } catch (err) {
      console.error('Error initializing sharing:', err);
      return false;
    }
  }

  private async loadRemoteEntry(
    remoteUrl: string,
    scope: string
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Check if the remote is already loaded
      if ((window as any)[scope]) {
        console.log(`${scope} already loaded`);
        return resolve();
      }

      try {
        const script = document.createElement('script');
        script.src = remoteUrl;

        // Try with both module and text/javascript
        // Some setups require module, others text/javascript
        script.type = 'text/javascript';

        // Add some diagnostic events
        script.onload = () => {
          console.log(
            `${scope} remote entry script loaded, checking for container...`
          );
          // Allow a small delay for the container to initialize
          setTimeout(() => {
            if ((window as any)[scope]) {
              console.log(`${scope} container found after script load!`);
              resolve();
            } else {
              console.warn(
                `Script loaded but ${scope} container not found in window object!`
              );
              console.log(
                'Available global objects:',
                Object.keys(window).filter((key) => !key.startsWith('_'))
              );
              // Try again with module type if it failed with text/javascript
              if (script.type === 'text/javascript') {
                console.log('Retrying with script type="module"...');
                const moduleScript = document.createElement('script');
                moduleScript.src = remoteUrl;
                moduleScript.type = 'module';
                document.head.appendChild(moduleScript);
                // Wait a bit longer for module script
                setTimeout(() => {
                  if ((window as any)[scope]) {
                    console.log(
                      `${scope} container found after module script load!`
                    );
                    resolve();
                  } else {
                    reject(
                      new Error(
                        `Remote container ${scope} not found after trying both script types`
                      )
                    );
                  }
                }, 1000);
              } else {
                reject(
                  new Error(
                    `Remote container ${scope} not found after script load`
                  )
                );
              }
            }
          }, 500);
        };

        script.onerror = (err) => {
          console.error(`Failed to load remote entry: ${remoteUrl}`, err);
          reject(new Error(`Failed to load remote entry: ${remoteUrl}`));
        };

        document.head.appendChild(script);
      } catch (err) {
        reject(new Error(`Exception loading remote entry: ${err}`));
      }
    });
  }

  async ngOnInit() {
    try {
      this.loading = true;

      console.log('1. Starting Module Federation load process');

      // 1. Initialize the shared scope
      await this.initSharing();
      console.log('2. Shared scope initialized');

      // 2. Load the remote entry
      await this.loadRemoteEntry(
        'http://localhost:3000/remoteEntry.js',
        'reactDashboard'
      );
      console.log('3. Remote entry load completed');

      // 3. Get the remote container and check what we have
      const container = (window as any)['reactDashboard'];
      console.log('4. Container object:', container);

      if (!container) {
        console.error('React remote container not found in window object!');
        console.log(
          'Available global properties:',
          Object.keys(window)
            .filter((key) => !key.startsWith('_') && typeof key === 'string')
            .slice(0, 20)
        );

        throw new Error(
          'Remote container not found after loading script. Check console for available globals.'
        );
      }

      // 4. Check container methods
      console.log('5. Container methods:', Object.keys(container));

      // 5. Initialize the container
      if (typeof container.init === 'function') {
        await container.init(__webpack_share_scopes__.default);
        console.log('6. Remote container initialized');
      } else {
        console.warn('Container has no init method. Trying to continue...');
      }

      // 6. Get the factory and create the component
      if (typeof container.get !== 'function') {
        throw new Error(
          'Container has no get method. Incompatible Module Federation setup.'
        );
      }

      // Try different module paths if needed
      let factory;
      try {
        factory = await container.get('./Dashboard');
        console.log('7. Factory obtained for ./Dashboard');
      } catch (err) {
        console.warn(
          'Failed to get ./Dashboard, trying ./dashboard (lowercase):',
          err
        );
        try {
          factory = await container.get('./dashboard');
          console.log('7. Factory obtained for ./dashboard (lowercase)');
        } catch (err2) {
          console.warn(
            'Failed to get ./dashboard, trying alternative paths:',
            err2
          );
          // Try to list available modules if possible
          throw new Error(
            'Could not get Dashboard component from remote. Check the export path.'
          );
        }
      }

      // 7. Create the component
      const Dashboard = factory();
      console.log('8. Dashboard component created:', Dashboard);
      console.log('8a. Default export available?', !!Dashboard.default);
      console.log('8b. Component structure:', Object.keys(Dashboard));

      // Determine which export to use (default or named)
      const ComponentToRender = Dashboard.default || Dashboard;

      // 8. Import React and ReactDOM
      const React = await import('react');
      const ReactDOM = await import('react-dom/client');
      console.log('9. React dependencies imported:', React.version);

      // 9. Create React root and render the Dashboard
      this.reactRoot = ReactDOM.createRoot(this.containerRef.nativeElement);

      // 10. Add some example props that might be needed by your React component
      const props = {
        fromAngular: true,
        timestamp: new Date().toISOString(),
      };

      console.log('10. Rendering React component with props:', props);
      this.reactRoot.render(React.createElement(ComponentToRender, props));
      console.log('11. React component rendered');

      this.loading = false;
    } catch (error: any) {
      console.error('Error loading React component:', error);
      this.error = error.message || 'Unknown error occurred';
      this.loading = false;
    }
  }

  ngOnDestroy() {
    if (this.reactRoot) {
      this.reactRoot.unmount();
    }
  }
}
