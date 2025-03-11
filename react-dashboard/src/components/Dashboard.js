import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>React Dashboard From React JS</h2>
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

export default Dashboard;
