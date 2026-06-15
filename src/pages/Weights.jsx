import React from 'react';
export default function Weights() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Bobot Kriteria</h1>
        <p className="page-subtitle">Atur bobot setiap kriteria penilaian</p>
      </div>
      <div className="empty-state">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p>Belum ada bobot yang diatur</p>
      </div>
    </div>
  );
}
