import React from 'react';
import { useNavigate } from 'react-router-dom';

// Mock data hasil peringkat untuk ditampilkan di landing page pengumuman
const mockRankings = [
  { rank: 1, name: 'Budi Santoso', score: '0.942', status: 'Sangat Layak' },
  { rank: 2, name: 'Siti Rahmawati', score: '0.895', status: 'Layak' },
  { rank: 3, name: 'Dewi Lestari', score: '0.871', status: 'Layak' },
  { rank: 4, name: 'Rian Hidayat', score: '0.812', status: 'Layak' },
  { rank: 5, name: 'Adi Wijaya', score: '0.758', status: 'Cukup Layak' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page-container">
      {/* ─── Navbar Publik ─── */}
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
        {/* ─── Hero Landing ─── */}
        <section className="landing-hero-section">
          <div className="hero-glow-public" />
          <h1 className="landing-title">
            Pengumuman Peringkat <span>Kinerja Karyawan</span>
          </h1>
          <p className="landing-subtitle">
            Hasil penilaian kinerja objektif menggunakan metode Weighted Aggregated Sum Product Assessment (WASPAS).
          </p>
        </section>

        {/* ─── Tabel Pengumuman Ranking ─── */}
        <section className="ranking-announcement-section">
          <div className="announcement-header">
            <div className="announcement-badge">
              <span className="pulse-dot" />
              Pengumuman Periode Aktif
            </div>
            <h2>Daftar Peringkat Karyawan Terbaik</h2>
            <p>Perangkingan transparan berdasarkan akumulasi nilai kriteria dan bobot keputusan.</p>
          </div>

          <div className="announcement-table-wrapper">
            <table className="announcement-table">
              <thead>
                <tr>
                  <th style={{ width: '80px', textAlign: 'center' }}>Rank</th>
                  <th>Nama Karyawan</th>
                  <th style={{ width: '150px', textAlign: 'center' }}>Skor Akhir (Qi)</th>
                  <th style={{ width: '180px', textAlign: 'center' }}>Klasifikasi</th>
                </tr>
              </thead>
              <tbody>
                {mockRankings.map((row) => (
                  <tr key={row.rank} className={row.rank <= 3 ? 'top-rank' : ''}>
                    <td className="rank-cell">
                      {row.rank <= 3 ? (
                        <span className={`rank-badge rank-badge--${row.rank}`}>
                          {row.rank}
                        </span>
                      ) : (
                        row.rank
                      )}
                    </td>
                    <td className="name-cell">
                      <strong>{row.name}</strong>
                    </td>
                    <td className="score-cell">{row.score}</td>
                    <td className="status-cell">
                      <span className={`status-pill ${row.rank <= 3 ? 'status-pill--success' : 'status-pill--info'}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── Penjelasan Singkat Metode ─── */}
        <section className="landing-features">
          <div className="feature-item">
            <h4>Kombinasi Metode WSM & WPM</h4>
            <p>WASPAS mengintegrasikan keunggulan *Weighted Sum Model* (WSM) dan *Weighted Product Model* (WPM) untuk menjaga konsistensi keputusan yang optimal.</p>
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
