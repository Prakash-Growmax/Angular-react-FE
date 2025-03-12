import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import Dashboard from "./components/Dashboard";

const queryClient = new QueryClient();

const App = () => {
  console.log("Afd");
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1>React Dashboard Standalone</h1>
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    </div>
  );
};

export default App;
