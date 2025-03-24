import React, { useState } from 'react';
import USAMap from './USAMap';
import '../styles/Dashboard.css';

function Dashboard() {
  const [dateRange, setDateRange] = useState('30');

  // Sample data for stats
  const stats = {
    newLeads: { count: 42, change: 12, positive: true },
    salesCalls: { count: 38, change: 5, positive: true },
    followUps: { count: 27, change: 3, positive: false },
    franchiseSales: { count: 8, change: 33, positive: true }
  };

  return (
    <section className="dashboard-view">
      <div className="dashboard-header">
        <h2><span className="highlight">Franchise Sales</span> Dashboard</h2>
        <div className="date-filter">
          <label htmlFor="date-range">Time Period:</label>
          <select 
            id="date-range" 
            className="sleek-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-user-plus"></i></div>
          <h3>New Leads</h3>
          <p className="stat-number">{stats.newLeads.count}</p>
          <p className={`stat-change ${stats.newLeads.positive ? 'positive' : 'negative'}`}>
            <i className={`fas fa-arrow-${stats.newLeads.positive ? 'up' : 'down'}`}></i> {stats.newLeads.change}%
          </p>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-phone-alt"></i></div>
          <h3>Sales Calls</h3>
          <p className="stat-number">{stats.salesCalls.count}</p>
          <p className={`stat-change ${stats.salesCalls.positive ? 'positive' : 'negative'}`}>
            <i className={`fas fa-arrow-${stats.salesCalls.positive ? 'up' : 'down'}`}></i> {stats.salesCalls.change}%
          </p>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-clipboard-check"></i></div>
          <h3>Follow-ups</h3>
          <p className="stat-number">{stats.followUps.count}</p>
          <p className={`stat-change ${stats.followUps.positive ? 'positive' : 'negative'}`}>
            <i className={`fas fa-arrow-${stats.followUps.positive ? 'up' : 'down'}`}></i> {stats.followUps.change}%
          </p>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-cookie"></i></div>
          <h3>Franchise Sales</h3>
          <p className="stat-number">{stats.franchiseSales.count}</p>
          <p className={`stat-change ${stats.franchiseSales.positive ? 'positive' : 'negative'}`}>
            <i className={`fas fa-arrow-${stats.franchiseSales.positive ? 'up' : 'down'}`}></i> {stats.franchiseSales.change}%
          </p>
        </div>
      </div>

      <div className="map-container">
        <h3>Franchise Locations Across the United States</h3>
        <USAMap />
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Sales Pipeline</h3>
          <canvas id="pipelineChart"></canvas>
        </div>
        <div className="chart-card">
          <h3>Development Progress</h3>
          <canvas id="developmentChart"></canvas>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <ul className="activity-list">
          <li>
            <span className="activity-time">Today, 2:30 PM</span>
            <span className="activity-type lead">Lead</span>
            <span className="activity-desc">New lead from John Smith in Austin, TX</span>
          </li>
          <li>
            <span className="activity-time">Today, 11:15 AM</span>
            <span className="activity-type call">Call</span>
            <span className="activity-desc">Sales call with Sarah Johnson completed</span>
          </li>
          <li>
            <span className="activity-time">Yesterday</span>
            <span className="activity-type sale">Sale</span>
            <span className="activity-desc">Franchise agreement signed with Mike Brown</span>
          </li>
          <li>
            <span className="activity-time">Mar 22, 2025</span>
            <span className="activity-type development">Development</span>
            <span className="activity-desc">Construction started for Denver location</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Dashboard;
