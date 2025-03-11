import React from "react";
import Dashboard from "./components/Dashboard";

const App = () => {
  console.log("Afd");
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1>React Dashboard Standalone</h1>
      <Dashboard />
    </div>
  );
};

export default App;
