import React from 'react';
import '../styles/Header.css';

function Header({ activeView, onNavigate }) {
  return (
    <header>
      <div className="logo-container">
        <img src="/Horizontal Black Logo.png" alt="Crave Cookies Logo" className="logo" />
      </div>
      <nav>
        <ul>
          <li>
            <a 
              href="#" 
              className={activeView === 'dashboard' ? 'active' : ''} 
              onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }}
            >
              <i className="fas fa-chart-line"></i> Dashboard
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={activeView === 'leads' ? 'active' : ''} 
              onClick={(e) => { e.preventDefault(); onNavigate('leads'); }}
            >
              <i className="fas fa-user-plus"></i> Leads
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={activeView === 'sales' ? 'active' : ''} 
              onClick={(e) => { e.preventDefault(); onNavigate('sales'); }}
            >
              <i className="fas fa-funnel-dollar"></i> Sales Pipeline
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={activeView === 'development' ? 'active' : ''} 
              onClick={(e) => { e.preventDefault(); onNavigate('development'); }}
            >
              <i className="fas fa-store"></i> Development
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
