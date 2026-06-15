import React from 'react';
export default function Scores() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Input Nilai</h1>
        <p className="page-subtitle">Masukkan nilai karyawan per kriteria</p>
      </div>
      <div className="empty-state">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p>Belum ada nilai yang diinput</p>
      </div>
    </div>
  );
}
