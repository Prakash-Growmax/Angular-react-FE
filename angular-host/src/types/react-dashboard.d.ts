import * as React from 'react';

declare module 'reactDashboard/Dashboard' {
  const Dashboard: React.ComponentType<any>;
  export default Dashboard;
}

declare global {
  interface Window {
    reactDashboard: any;
  }
}
