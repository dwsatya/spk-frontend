import React from 'react';
export default function Ranking() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Hasil Peringkat WASPAS</h1>
        <p className="page-subtitle">Hasil perhitungan dan peringkat karyawan terbaik</p>
      </div>
      <div className="empty-state">
        <svg viewBox="0 0 24 24" fill="none">
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p>Belum ada hasil peringkat tersedia</p>
      </div>
    </div>
  );
}
