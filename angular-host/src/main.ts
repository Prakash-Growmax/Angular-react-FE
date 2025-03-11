// main.ts
import { loadRemoteEntry } from '@angular-architects/module-federation';

// Load the remote entries before bootstrapping
Promise.all([
  loadRemoteEntry('http://localhost:3000/remoteEntry.js', 'reactDashboard'),
])
  .catch((err) => console.error('Error loading remote entries:', err))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error('Error bootstrapping app:', err));
