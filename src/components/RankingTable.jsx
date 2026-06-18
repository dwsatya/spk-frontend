import React from 'react';
import { formatWaspasScore, getWaspasClassification } from '../services/api';

export default function RankingTable({
  rankings = [],
  loading = false,
  showDetails = false,
  emptyMessage = 'Belum ada hasil peringkat tersedia',
}) {
  const colSpan = showDetails ? 6 : 4;

  return (
    <div className="announcement-table-wrapper">
      <table className="announcement-table">
        <thead>
          <tr>
            <th style={{ width: '80px', textAlign: 'center' }}>Rank</th>
            <th>Nama Karyawan</th>
            {showDetails && (
              <>
                <th style={{ width: '130px', textAlign: 'center' }}>Q1 (WSM)</th>
                <th style={{ width: '130px', textAlign: 'center' }}>Q2 (WPM)</th>
              </>
            )}
            <th style={{ width: '150px', textAlign: 'center' }}>Skor Akhir (Qi)</th>
            <th style={{ width: '180px', textAlign: 'center' }}>Klasifikasi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={colSpan} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                Memuat hasil peringkat WASPAS...
              </td>
            </tr>
          ) : rankings.length === 0 ? (
            <tr>
              <td colSpan={colSpan} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rankings.map((row) => (
              <tr key={row.employee_id || row.rank} className={row.rank <= 3 ? 'top-rank' : ''}>
                <td className="rank-cell">
                  {row.rank <= 3 ? (
                    <span className={`rank-badge rank-badge--${row.rank}`}>{row.rank}</span>
                  ) : (
                    row.rank
                  )}
                </td>
                <td className="name-cell">
                  <strong>{row.employee_name}</strong>
                  {showDetails && row.current_position && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      {row.current_position}
                      {row.department ? ` · ${row.department}` : ''}
                    </div>
                  )}
                </td>
                {showDetails && (
                  <>
                    <td className="score-cell" style={{ fontSize: '0.9rem' }}>
                      {formatWaspasScore(row.q1_wsm)}
                    </td>
                    <td className="score-cell" style={{ fontSize: '0.9rem' }}>
                      {formatWaspasScore(row.q2_wpm)}
                    </td>
                  </>
                )}
                <td className="score-cell">{formatWaspasScore(row.q_final)}</td>
                <td className="status-cell">
                  <span
                    className={`status-pill ${
                      row.rank <= 3 ? 'status-pill--success' : 'status-pill--info'
                    }`}
                  >
                    {getWaspasClassification(row.q_final)}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
