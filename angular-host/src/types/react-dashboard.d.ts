declare module 'reactDashboard/Dashboard' {
  const Dashboard: React.ComponentType<any>;
  export default Dashboard;
}

// Add a declaration for the global container
interface Window {
  reactDashboard: any;
}
