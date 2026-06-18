import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import RankingTable from '../components/RankingTable';
import { getWaspasRanking, unwrapList, getApiError } from '../services/api';

export default function LandingPage() {
  const navigate = useNavigate();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRanking = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getWaspasRanking();
      const list = unwrapList(res).sort((a, b) => a.rank - b.rank);
      setRankings(list);
    } catch (err) {
      setError(getApiError(err, 'Gagal memuat pengumuman peringkat.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRanking();
  }, [fetchRanking]);

  return (
    <div className="landing-page-container">
      <header className="landing-navbar">
        <div className="landing-logo">
          <div className="brand-icon-sm">
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="logo-text">SPK<span>WASPAS</span></span>
        </div>
        <button className="login-btn-public" onClick={() => navigate('/login')}>
          Login System
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>

      <main className="landing-main">
        <section className="landing-hero-section">
          <div className="hero-glow-public" />
          <h1 className="landing-title">
            Pengumuman Peringkat <span>Kinerja Karyawan</span>
          </h1>
          <p className="landing-subtitle">
            Hasil penilaian kinerja objektif menggunakan metode Weighted Aggregated Sum Product Assessment (WASPAS).
          </p>
        </section>

        <section className="ranking-announcement-section">
          <div className="announcement-header">
            <div className="announcement-badge">
              <span className="pulse-dot" />
              Pengumuman Periode Aktif
            </div>
            <h2>Daftar Peringkat Karyawan Terbaik</h2>
            <p>Perangkingan transparan berdasarkan akumulasi nilai kriteria dan bobot keputusan.</p>
          </div>

          {error && (
            <div className="landing-ranking-error">
              <p>{error}</p>
              <button type="button" className="btn-secondary-spk" onClick={fetchRanking}>
                Coba Lagi
              </button>
            </div>
          )}

          <RankingTable
            rankings={rankings}
            loading={loading}
            emptyMessage="Belum ada hasil peringkat. Pastikan data karyawan, kriteria, dan nilai sudah lengkap."
          />

          {!loading && rankings.length > 0 && (
            <p className="landing-ranking-note">
              Menampilkan {rankings.length} karyawan terperingkat berdasarkan perhitungan WASPAS terbaru.
            </p>
          )}
        </section>

        <section className="landing-features">
          <div className="feature-item">
            <h4>Kombinasi Metode WSM & WPM</h4>
            <p>WASPAS mengintegrasikan keunggulan Weighted Sum Model (WSM) dan Weighted Product Model (WPM) untuk menjaga konsistensi keputusan yang optimal.</p>
          </div>
          <div className="feature-item">
            <h4>Transparansi Penuh</h4>
            <p>Seluruh karyawan dapat melihat skor kelayakan akhir (Qi) untuk memastikan proses penilaian berjalan adil dan bebas dari bias.</p>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>&copy; 2026 SPK WASPAS. Sistem Pengambilan Keputusan Kinerja Karyawan.</p>
      </footer>
    </div>
  );
}
