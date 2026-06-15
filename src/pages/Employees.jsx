import React from 'react';
export default function Employees() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Manajemen Karyawan</h1>
        <p className="page-subtitle">Kelola data karyawan untuk penilaian</p>
      </div>
      <div className="empty-state">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        </svg>
        <p>Belum ada data karyawan</p>
      </div>
    </div>
  );
}
