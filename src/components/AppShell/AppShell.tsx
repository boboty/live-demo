import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { company } from '../../data/company';
import './AppShell.css';

const AppShell: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-left">
          <div className="app-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            🐝 蜂税通
          </div>
          <div className="app-logo-sub">9810 出口业务服务中心</div>
        </div>
        <div className="app-header-right">
          <span className="company-name">{company.shortName}</span>
          <span className="period">{company.exportPeriod}</span>
        </div>
      </header>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppShell;