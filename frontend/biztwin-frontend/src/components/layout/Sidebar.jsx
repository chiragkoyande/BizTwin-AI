import React from 'react';
import {
  ArrowRight, ChevronDown, CircleHelp, GitBranch, Search, Settings, X
} from 'lucide-react';
import { number } from '../../format';
import { navSections } from '../../constants/navigation';

export default function Sidebar({
  page,
  setPage,
  mobileNav,
  setMobileNav,
  search,
  setSearch,
  dataset
}) {
  const ds = dataset || {
    name: 'DataCo Supply Chain (2015-2018)',
    rows: 180519
  };

  return (
    <aside className={`sidebar ${mobileNav ? 'open' : ''}`}>
      <div className="brand">
        <div className="brand-mark"><GitBranch size={20} /></div>
        <div>
          <b>Digital Twin</b>
          <small>For Small Businesses</small>
        </div>
        <button className="close-nav" onClick={() => setMobileNav(false)}>
          <X size={18} />
        </button>
      </div>

      <div className="workspace-switch">
        <div className="workspace-avatar">DT</div>
        <div>
          <strong>Enterprise Supply Chain</strong>
          <small>{number(ds.rows)} Records · Live</small>
        </div>
        <ChevronDown size={14} color="#94A3B8" />
      </div>

      <div className="nav-search">
        <Search size={14} color="#64748B" />
        <input
          placeholder="Search navigation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            style={{ background: 'none', border: 0, color: '#94A3B8', cursor: 'pointer', padding: 0 }}
            aria-label="Clear search"
          >
            <X size={13} />
          </button>
        )}
      </div>

      <div className="sidebar-scrollable">
        {navSections.map((sec) => {
          const secItems = sec.items.filter((item) =>
            item.label.toLowerCase().includes(search.toLowerCase())
          );
          if (secItems.length === 0) return null;
          return (
            <div key={sec.category} className="nav-section">
              <div className="nav-label">{sec.category}</div>
              <nav>
                {secItems.map((item) => (
                  <button
                    key={item.id}
                    className={`nav-item ${page === item.id ? 'active' : ''}`}
                    onClick={() => {
                      setPage(item.id);
                      setMobileNav(false);
                    }}
                    title={item.label}
                  >
                    <item.icon size={17} />
                    <span className="nav-label-text">{item.label}</span>
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                  </button>
                ))}
              </nav>
            </div>
          );
        })}
      </div>

      <div className="sidebar-bottom">
        <div className="help-card">
          <div className="help-icon"><CircleHelp size={18} /></div>
          <strong>Evaluation Review Ready</strong>
          <p>Demonstrates all 4 architectural phases defined in the SMB Digital Twin paper.</p>
          <button onClick={() => setPage('models')}>
            View Benchmark Specs <ArrowRight size={13} />
          </button>
        </div>
        <div className="profile">
          <div className="profile-avatar">SJ</div>
          <div>
            <strong>Sam Joshi</strong>
            <small>Enterprise Admin</small>
          </div>
          <Settings size={16} color="#64748B" />
        </div>
      </div>
    </aside>
  );
}
