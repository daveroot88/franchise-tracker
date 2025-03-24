import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Leads from './components/Leads';
import SalesPipeline from './components/SalesPipeline';
import DevelopmentTracker from './components/DevelopmentTracker';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const handleNavigation = (view) => {
    setActiveView(view);
  };

  return (
    <div className="app">
      <Header activeView={activeView} onNavigate={handleNavigation} />
      <main>
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'leads' && <Leads />}
        {activeView === 'sales' && <SalesPipeline />}
        {activeView === 'development' && <DevelopmentTracker />}
      </main>
    </div>
  );
}

export default App;
