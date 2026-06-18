import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getEmployees, getAllScores, getWaspasRanking, unwrapList } from '../../services/api';

const quickActions = [
  {
    path: '/employees',
    label: 'Input Karyawan',
    desc: 'Tambah & kelola data karyawan',
    color: 'action--purple',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        <line x1="19" y1="8" x2="19" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="22" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
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
    label: 'Lihat Peringkat',
    desc: 'Pantau hasil ranking karyawan',
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
    key: 'scores',
    label: 'Nilai Diinput',
    value: '—',
    color: 'stat-icon--amber',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

export default function HrdDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ employees: '—', scores: '—', ranking: '—' });

  useEffect(() => {
    Promise.all([getEmployees(), getAllScores(), getWaspasRanking()])
      .then(([empRes, scoresRes, rankRes]) => {
        const employees = unwrapList(empRes);
        const scoreRows = unwrapList(scoresRes);
        const uniqueEmployees = new Set(scoreRows.map((s) => s.employee_id));
        setStats({
          employees: employees.length,
          scores: uniqueEmployees.size,
          ranking: unwrapList(rankRes).length,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="page-container">
      {/* Hero Welcome Banner */}
      <div className="dashboard-hero dashboard-hero--hrd">
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-left">
            <div className="role-badge role-badge--hrd">
              <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              </svg>
              HRD
            </div>
            <h1 className="hero-title">
              Selamat Datang, <span>{user?.name || 'HRD'}!</span>
            </h1>
            <p className="hero-subtitle">
              Input data karyawan, nilai kriteria, dan pantau hasil peringkat
            </p>
          </div>
          <div className="hero-decoration">
            <div className="hero-icon-ring hero-icon-ring--hrd">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
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
        <h2 className="section-title">Menu Utama</h2>
        <p className="section-subtitle">Navigasi ke modul yang tersedia untuk Anda</p>
      </div>

      <div className="quick-actions-grid quick-actions-grid--3">
        {quickActions.map((action) => (
          <button
            key={action.path}
            className={`action-card ${action.color}`}
            onClick={() => navigate(action.path)}
            id={`hrd-action-${action.path.replace('/', '')}`}
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
