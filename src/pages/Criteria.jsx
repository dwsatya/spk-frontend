import React from 'react';
export default function Criteria() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Kriteria Penilaian</h1>
        <p className="page-subtitle">Tentukan kriteria untuk metode WASPAS</p>
      </div>
      <div className="empty-state">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p>Belum ada kriteria yang ditambahkan</p>
      </div>
    </div>
  );
}
