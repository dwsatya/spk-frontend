import React, { useState, useEffect, useCallback, useMemo } from 'react';
import RankingTable from '../components/RankingTable';
import {
  getWaspasRanking,
  getEmployees,
  unwrapList,
  getApiError,
  formatWaspasScore,
} from '../services/api';

export default function Ranking() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchRanking = useCallback(async () => {
    setLoading(true);
    try {
      const [rankRes, empRes] = await Promise.all([
        getWaspasRanking(),
        getEmployees(),
      ]);

      const rankList = unwrapList(rankRes).sort((a, b) => a.rank - b.rank);
      const employees = unwrapList(empRes);
      const empMap = Object.fromEntries(employees.map((e) => [e.id, e]));

      const enriched = rankList.map((row) => ({
        ...row,
        current_position: empMap[row.employee_id]?.current_position || '',
        department: empMap[row.employee_id]?.department || '',
      }));

      setRankings(enriched);
    } catch (err) {
      showToast(getApiError(err, 'Gagal memuat hasil peringkat.'), 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRanking();
  }, [fetchRanking]);

  const stats = useMemo(() => {
    if (rankings.length === 0) {
      return { total: 0, topScore: '—', avgScore: '—' };
    }
    const top = rankings[0];
    const avg =
      rankings.reduce((sum, r) => sum + (parseFloat(r.q_final) || 0), 0) / rankings.length;
    return {
      total: rankings.length,
      topScore: formatWaspasScore(top.q_final),
      avgScore: avg.toFixed(4),
    };
  }, [rankings]);

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 className="page-title">Hasil Peringkat WASPAS</h1>
          <p className="page-subtitle">
            Hasil perhitungan peringkat karyawan menggunakan metode WASPAS (WSM + WPM)
          </p>
        </div>
        <button
          className="btn-primary-spk"
          onClick={fetchRanking}
          disabled={loading}
          style={{ flexShrink: 0 }}
        >
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <polyline points="23 4 23 10 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {loading ? 'Memuat...' : 'Hitung Ulang'}
        </button>
      </div>

      <div className="scores-stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon stat-icon--green">
            <svg viewBox="0 0 24 24" fill="none">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Terperingkat</span>
            <span className="stat-value">{loading ? '—' : stats.total}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--cyan">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Skor Tertinggi (Qi)</span>
            <span className="stat-value" style={{ fontSize: '1.35rem' }}>{stats.topScore}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--purple">
            <svg viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Rata-rata Qi</span>
            <span className="stat-value" style={{ fontSize: '1.35rem' }}>{stats.avgScore}</span>
          </div>
        </div>
      </div>

      <div className="ranking-page-table-card">
        <div className="ranking-page-table-header">
          <h2>Matriks Hasil Perhitungan WASPAS</h2>
          <p>Q1 = Weighted Sum Model · Q2 = Weighted Product Model · Qi = Skor akhir WASPAS</p>
        </div>
        <RankingTable
          rankings={rankings}
          loading={loading}
          showDetails
          emptyMessage="Belum ada hasil peringkat. Lengkapi data karyawan, kriteria, bobot, dan nilai terlebih dahulu."
        />
      </div>

      {toast && (
        <div className="toast-notification">
          <div className={`toast-icon toast-icon--${toast.type}`}>
            {toast.type === 'success' ? (
              <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </div>
          <span className="toast-text">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
