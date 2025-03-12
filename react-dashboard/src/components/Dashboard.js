import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import React from "react";
import defaultQueryClient from "../shared/queryClientSingleton";
import "./Dashboard.css";

// The actual Dashboard content component
const DashboardContent = (props) => {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["repoData"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.github.com/repos/TanStack/query"
      );
      return await response.json();
    },
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="dashboard">
      <h2>
        React Dashboard From React JS{" "}
        {props.fromAngular ? "(Embedded in Angular)" : ""}
      </h2>
      <div style={{ marginBottom: "10px" }}>
        <h1>{data.full_name}</h1>
        <p>{data.description}</p>
        <strong>👀 {data.subscribers_count}</strong>{" "}
        <strong>✨ {data.stargazers_count}</strong>{" "}
        <strong>🍴 {data.forks_count}</strong>
        <div>{isFetching ? "Updating..." : ""}</div>
      </div>
      <div className="dashboard-grid">
        <div className="card">
          <h3>Total Sales </h3>
          <p className="value">$12,512</p>
          <p className="trend positive">↑ 15%</p>
        </div>
        <div className="card">
          <h3>Active Users</h3>
          <p className="value">12,234</p>
          <p className="trend positive">↑ 8%</p>
        </div>
        <div className="card">
          <h3>Conversion Rate</h3>
          <p className="value">75.6%</p>
          <p className="trend negative">↓ 2%</p>
        </div>
        <div className="card">
          <h3>Avg. Session</h3>
          <p className="value">4m 23s</p>
          <p className="trend positive">↑ 12%</p>
        </div>
      </div>
    </div>
  );
};

// Flexible Dashboard component that can work with or without an external QueryClientProvider
const Dashboard = ({ queryClient = defaultQueryClient, ...props }) => {
  // Check if we already have a QueryClientProvider in the React tree
  const hasQueryClientProvider = () => {
    try {
      // This is a hacky way to detect if we're within a QueryClientProvider
      // A better approach would be to use React Context directly
      return !!useQuery.getContext();
    } catch (e) {
      return false;
    }
  };

  // If we already have a QueryClientProvider, just render the content
  if (hasQueryClientProvider()) {
    return <DashboardContent {...props} />;
  }

  // Otherwise, provide our own QueryClientProvider
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent {...props} />
    </QueryClientProvider>
  );
};

// For direct usage in React components where you know QueryClientProvider exists
Dashboard.Content = DashboardContent;

export default Dashboard;
