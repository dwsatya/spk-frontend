import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getEmployees,
  getCriteria,
  unwrapList,
  getApiError,
} from '../services/api';

const FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: 'complete', label: 'Lengkap' },
  { key: 'partial', label: 'Sebagian' },
  { key: 'empty', label: 'Belum Diinput' },
];

function getEmployeeScoreStatus(empId, criteria, scores) {
  if (criteria.length === 0) return 'empty';
  const empScores = scores[empId] || {};
  const filled = criteria.filter((c) => empScores[c.code] !== undefined && empScores[c.code] !== '').length;
  if (filled === 0) return 'empty';
  if (filled === criteria.length) return 'complete';
  return 'partial';
}

function getStatusLabel(status) {
  if (status === 'complete') return 'Lengkap';
  if (status === 'partial') return 'Sebagian';
  return 'Belum';
}

export default function Scores() {
  const [employees, setEmployees] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [empRes, critRes] = await Promise.all([getEmployees(), getCriteria()]);
      setEmployees(unwrapList(empRes));
      setCriteria(unwrapList(critRes));

      const savedScores = localStorage.getItem('spk_scores');
      if (savedScores) {
        setScores(JSON.parse(savedScores));
      }
    } catch (err) {
      showToast(getApiError(err, 'Gagal memuat data.'), 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = useMemo(() => {
    const complete = employees.filter(
      (e) => getEmployeeScoreStatus(e.id, criteria, scores) === 'complete'
    ).length;
    const partial = employees.filter(
      (e) => getEmployeeScoreStatus(e.id, criteria, scores) === 'partial'
    ).length;
    const empty = employees.filter(
      (e) => getEmployeeScoreStatus(e.id, criteria, scores) === 'empty'
    ).length;
    const progress = employees.length > 0 ? Math.round((complete / employees.length) * 100) : 0;

    return { complete, partial, empty, progress };
  }, [employees, criteria, scores]);

  const handleOpenInput = (emp) => {
    setSelectedEmp(emp);
    const empScores = scores[emp.id] || {};
    const initialValues = {};
    criteria.forEach((crit) => {
      initialValues[crit.code] =
        empScores[crit.code] !== undefined ? empScores[crit.code] : '';
    });
    setFormValues(initialValues);
    setModalOpen(true);
  };

  const handleInputChange = (code, val) => {
    setFormValues((prev) => ({ ...prev, [code]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const unfilled = criteria.find(
      (c) => formValues[c.code] === '' || formValues[c.code] === undefined
    );
    if (unfilled) {
      showToast(`Harap isi nilai kriteria ${unfilled.code}!`, 'error');
      return;
    }

    const numericScores = {};
    criteria.forEach((crit) => {
      numericScores[crit.code] = parseFloat(formValues[crit.code]) || 0;
    });

    const newScores = { ...scores, [selectedEmp.id]: numericScores };
    setScores(newScores);
    localStorage.setItem('spk_scores', JSON.stringify(newScores));
    showToast(`Nilai evaluasi "${selectedEmp.name}" berhasil disimpan.`);
    setModalOpen(false);
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      String(emp.id).includes(search) ||
      emp.department?.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;

    const status = getEmployeeScoreStatus(emp.id, criteria, scores);
    if (filter === 'all') return true;
    return status === filter;
  });

  const filledInModal = criteria.filter(
    (c) => formValues[c.code] !== '' && formValues[c.code] !== undefined
  ).length;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Input Nilai Karyawan</h1>
        <p className="page-subtitle">
          Kelola matriks keputusan evaluasi kinerja karyawan berdasarkan kriteria penilaian WASPAS yang aktif
        </p>
      </div>

      {/* Stat Cards */}
      <div className="scores-stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon--purple">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Karyawan</span>
            <span className="stat-value">{loading ? '—' : employees.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--cyan">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Kriteria Aktif</span>
            <span className="stat-value">{loading ? '—' : criteria.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--green">
            <svg viewBox="0 0 24 24" fill="none">
              <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Evaluasi Lengkap</span>
            <span className="stat-value">{loading ? '—' : stats.complete}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--amber">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Belum Diinput</span>
            <span className="stat-value">{loading ? '—' : stats.empty + stats.partial}</span>
          </div>
        </div>
      </div>

      {/* Progress Banner */}
      {!loading && employees.length > 0 && criteria.length > 0 && (
        <div className="scores-progress-box">
          <div className="scores-progress-info">
            <strong>Progress Input Nilai</strong>
            <p>
              {stats.complete} dari {employees.length} karyawan sudah memiliki nilai lengkap untuk seluruh kriteria.
            </p>
            <div className="scores-progress-bar">
              <div className="scores-progress-fill" style={{ width: `${stats.progress}%` }} />
            </div>
          </div>
          <div className="scores-progress-pct">{stats.progress}%</div>
        </div>
      )}

      {/* Actions */}
      <div className="crud-actions" style={{ marginBottom: '1rem' }}>
        <div className="search-input-wrapper">
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Cari nama, ID, atau departemen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="scores-filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`scores-filter-tab ${filter === f.key ? 'scores-filter-tab--active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Matrix Table */}
      <div className="table-container scores-matrix-wrap">
        {!loading && criteria.length === 0 ? (
          <div className="scores-empty-state">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p>Belum ada kriteria penilaian</p>
            <small>Tambahkan kriteria terlebih dahulu di halaman Kriteria sebelum menginput nilai.</small>
          </div>
        ) : !loading && employees.length === 0 ? (
          <div className="scores-empty-state">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <p>Belum ada data karyawan</p>
            <small>Tambahkan karyawan terlebih dahulu di halaman Karyawan.</small>
          </div>
        ) : (
          <table className="spk-table scores-matrix-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>No</th>
                <th className="scores-emp-cell">Karyawan</th>
                {criteria.map((crit) => (
                  <th key={crit.id} className="crit-header" title={`${crit.name} (${crit.attribute})`}>
                    <span className="crit-header-code">{crit.code}</span>
                    <span className="crit-header-name">{crit.name}</span>
                  </th>
                ))}
                <th style={{ width: '100px', textAlign: 'center' }}>Status</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={criteria.length + 4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    Memuat data matriks nilai...
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={criteria.length + 4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    Tidak ada karyawan yang cocok dengan filter
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp, idx) => {
                  const empScores = scores[emp.id] || {};
                  const status = getEmployeeScoreStatus(emp.id, criteria, scores);

                  return (
                    <tr key={emp.id}>
                      <td>{idx + 1}</td>
                      <td className="scores-emp-cell">
                        <div className="scores-emp-name">{emp.name}</div>
                        <div className="scores-emp-meta">
                          ID {emp.id} · {emp.current_position} · {emp.department}
                        </div>
                      </td>
                      {criteria.map((crit) => {
                        const scoreVal = empScores[crit.code];
                        return (
                          <td key={crit.id} style={{ textAlign: 'center' }}>
                            {scoreVal !== undefined ? (
                              <span className="score-value-pill">{scoreVal}</span>
                            ) : (
                              <span className="score-value-empty">—</span>
                            )}
                          </td>
                        );
                      })}
                      <td style={{ textAlign: 'center' }}>
                        <span className={`scores-status-pill scores-status-pill--${status}`}>
                          {getStatusLabel(status)}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions" style={{ justifyContent: 'center' }}>
                          <button
                            className="btn-icon-action btn-icon-action--edit"
                            onClick={() => handleOpenInput(emp)}
                            title={status === 'complete' ? 'Edit Nilai' : 'Input Nilai'}
                          >
                            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Input Modal */}
      {modalOpen && selectedEmp && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3>Input Nilai Evaluasi</h3>
              <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="scores-modal-emp-card">
                  <div className="scores-modal-avatar">
                    {selectedEmp.name?.charAt(0)?.toUpperCase() || 'K'}
                  </div>
                  <div className="scores-modal-emp-info">
                    <strong>{selectedEmp.name}</strong>
                    <span>
                      {selectedEmp.current_position} · {selectedEmp.department}
                    </span>
                  </div>
                </div>

                {criteria.length > 0 && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Terisi {filledInModal} / {criteria.length} kriteria
                  </p>
                )}

                <div className="scores-criteria-grid">
                  {criteria.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      Harap tambah kriteria di modul kriteria terlebih dahulu.
                    </p>
                  ) : (
                    criteria.map((crit) => (
                      <div className="scores-criteria-input-card" key={crit.id}>
                        <div className="scores-criteria-input-header">
                          <label>
                            {crit.code} — {crit.name}
                          </label>
                          <div className="scores-criteria-meta">
                            <span className={`scores-criteria-tag scores-criteria-tag--${crit.attribute}`}>
                              {crit.attribute}
                            </span>
                            <span className="scores-criteria-tag scores-criteria-tag--unit">
                              {crit.unit}
                            </span>
                          </div>
                        </div>
                        <div className="input-wrapper">
                          <input
                            type="number"
                            step="any"
                            min="0"
                            placeholder={`Nilai (${crit.unit})...`}
                            value={formValues[crit.code] !== undefined ? formValues[crit.code] : ''}
                            onChange={(e) => handleInputChange(crit.code, e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary-spk" onClick={() => setModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-primary-spk" disabled={criteria.length === 0}>
                  Simpan Evaluasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
