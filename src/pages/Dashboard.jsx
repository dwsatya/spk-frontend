import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Selamat datang, {user?.name || 'Pengguna'}!</p>
      </div>
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon--blue">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Karyawan</span>
            <span className="stat-value">—</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--purple">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Kriteria</span>
            <span className="stat-value">—</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--green">
            <svg viewBox="0 0 24 24" fill="none">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Hasil Peringkat</span>
            <span className="stat-value">—</span>
          </div>
        </div>
      </div>
    </div>
  );
}
