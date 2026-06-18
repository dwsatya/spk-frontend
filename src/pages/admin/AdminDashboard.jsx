import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUsers, getEmployees, getCriteria, unwrapList } from '../../services/api';

const quickActions = [
  {
    path: '/users',
    label: 'Manage User',
    desc: 'Kelola akun pengguna sistem',
    color: 'action--indigo',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    path: '/employees',
    label: 'Karyawan',
    desc: 'Data karyawan untuk penilaian',
    color: 'action--purple',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    path: '/criteria',
    label: 'Kriteria',
    desc: 'Kelola kriteria penilaian WASPAS',
    color: 'action--cyan',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },

  {
    path: '/scores',
    label: 'Input Nilai',
    desc: 'Input nilai kriteria karyawan',
    color: 'action--amber',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    path: '/ranking',
    label: 'Peringkat',
    desc: 'Lihat hasil ranking WASPAS',
    color: 'action--green',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const statCardDefs = [
  {
    key: 'users',
    label: 'Total Pengguna',
    value: '—',
    color: 'stat-icon--blue',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: 'employees',
    label: 'Total Karyawan',
    value: '—',
    color: 'stat-icon--purple',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    key: 'criteria',
    label: 'Total Kriteria',
    value: '—',
    color: 'stat-icon--cyan',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: 'ranking',
    label: 'Hasil Peringkat',
    value: '—',
    color: 'stat-icon--green',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: '—', employees: '—', criteria: '—', ranking: '—' });

  useEffect(() => {
    Promise.all([getUsers(), getEmployees(), getCriteria()])
      .then(([usersRes, empRes, critRes]) => {
        setStats({
          users: unwrapList(usersRes).length,
          employees: unwrapList(empRes).length,
          criteria: unwrapList(critRes).length,
          ranking: '—',
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="page-container">
      {/* Hero Welcome Banner */}
      <div className="dashboard-hero dashboard-hero--admin">
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-left">
            <div className="role-badge role-badge--admin">
              <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
              Administrator
            </div>
            <h1 className="hero-title">
              Selamat Datang, <span>{user?.name || 'Admin'}!</span>
            </h1>
            <p className="hero-subtitle">
              Anda memiliki akses penuh ke seluruh fitur sistem SPK WASPAS
            </p>
          </div>
          <div className="hero-decoration">
            <div className="hero-icon-ring">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        {statCardDefs.map((s) => (
          <div className="stat-card" key={s.key}>
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div className="stat-info">
              <span className="stat-label">{s.label}</span>
              <span className="stat-value">{stats[s.key]}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="section-header">
        <h2 className="section-title">Akses Cepat</h2>
        <p className="section-subtitle">Navigasi ke semua modul sistem</p>
      </div>

      <div className="quick-actions-grid">
        {quickActions.map((action) => (
          <button
            key={action.path}
            className={`action-card ${action.color}`}
            onClick={() => navigate(action.path)}
            id={`admin-action-${action.path.replace('/', '')}`}
          >
            <div className="action-card-icon">{action.icon}</div>
            <div className="action-card-info">
              <span className="action-card-label">{action.label}</span>
              <span className="action-card-desc">{action.desc}</span>
            </div>
            <div className="action-card-arrow">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
