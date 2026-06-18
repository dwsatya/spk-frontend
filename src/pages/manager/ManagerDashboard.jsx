import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCriteria, getWaspasRanking, unwrapList } from "../../services/api";

const quickActions = [
  {
    path: "/criteria",
    label: "Kelola Kriteria",
    desc: "Tambah, edit, dan atur bobot kriteria penilaian",
    color: "action--cyan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M9 11l3 3L22 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    path: "/ranking",
    label: "Lihat Peringkat",
    desc: "Pantau hasil ranking karyawan",
    color: "action--green",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <polyline
          points="22,12 18,12 15,21 9,3 6,12 2,12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const statCardDefs = [
  {
    key: "criteria",
    label: "Total Kriteria",
    value: "—",
    color: "stat-icon--cyan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M9 11l3 3L22 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: "weight",
    label: "Total Bobot",
    value: "—",
    color: "stat-icon--teal",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L2 7l10 5 10-5-10-5z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 17l10 5 10-5M2 12l10 5 10-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "ranking",
    label: "Hasil Peringkat",
    value: "—",
    color: "stat-icon--green",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <polyline
          points="22,12 18,12 15,21 9,3 6,12 2,12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function ManagerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ criteria: "—", weight: "—", ranking: "—" });

  useEffect(() => {
    Promise.all([getCriteria(), getWaspasRanking()])
      .then(([critRes, rankRes]) => {
        const list = unwrapList(critRes);
        const totalWeight = list.reduce((sum, c) => sum + (parseFloat(c.weight) || 0), 0);
        setStats({
          criteria: list.length,
          weight: totalWeight.toFixed(2),
          ranking: unwrapList(rankRes).length,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="page-container">
      {/* Hero Welcome Banner */}
      <div className="dashboard-hero dashboard-hero--manager">
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-left">
            <div className="role-badge role-badge--manager">
              <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                <rect
                  x="2"
                  y="7"
                  width="20"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Manager
            </div>
            <h1 className="hero-title">
              Selamat Datang, <span>{user?.name || "Manager"}!</span>
            </h1>
            <p className="hero-subtitle">
              Kelola kriteria beserta bobot penilaian dan pantau hasil peringkat
              karyawan
            </p>
          </div>
          <div className="hero-decoration">
            <div className="hero-icon-ring hero-icon-ring--manager">
              <svg viewBox="0 0 24 24" fill="none">
                <rect
                  x="2"
                  y="7"
                  width="20"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="dashboard-grid" style={{ marginBottom: "2rem" }}>
        {statCardDefs.map((s) => (
          <div className="stat-card" key={s.key}>
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div className="stat-info">
              <span className="stat-label">{s.label}</span>
              <span className="stat-value">{stats[s.key]}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="section-header">
        <h2 className="section-title">Menu Utama</h2>
        <p className="section-subtitle">
          Navigasi ke modul yang tersedia untuk Anda
        </p>
      </div>

      <div className="quick-actions-grid">
        {quickActions.map((action) => (
          <button
            key={action.path}
            className={`action-card ${action.color}`}
            onClick={() => navigate(action.path)}
            id={`manager-action-${action.path.replace("/", "")}`}
          >
            <div className="action-card-icon">{action.icon}</div>
            <div className="action-card-info">
              <span className="action-card-label">{action.label}</span>
              <span className="action-card-desc">{action.desc}</span>
            </div>
            <div className="action-card-arrow">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
