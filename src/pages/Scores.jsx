import React, { useState, useEffect, useCallback } from 'react';
import {
  getEmployees,
  getCriteria,
  unwrapList,
  getApiError,
} from '../services/api';

export default function Scores() {
  const [employees, setEmployees] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      String(emp.id).includes(search)
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Input Nilai Karyawan</h1>
        <p className="page-subtitle">
          Masukkan matriks nilai keputusan evaluasi masing-masing alternatif karyawan berdasarkan kriteria penilaian aktif
        </p>
      </div>

      <div className="crud-actions">
        <div className="search-input-wrapper">
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Cari karyawan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="spk-table" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>No</th>
              <th style={{ width: '220px' }}>Nama Lengkap</th>
              {criteria.map((crit) => (
                <th key={crit.id} style={{ textAlign: 'center' }} title={crit.name}>
                  {crit.code}
                </th>
              ))}
              <th style={{ width: '130px', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={criteria.length + 3} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  Memuat data...
                </td>
              </tr>
            ) : filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={criteria.length + 3} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  Tidak ada data karyawan ditemukan
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp, idx) => {
                const empScores = scores[emp.id] || {};
                return (
                  <tr key={emp.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <strong>{emp.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {emp.current_position} · {emp.department}
                      </div>
                    </td>
                    {criteria.map((crit) => {
                      const scoreVal = empScores[crit.code];
                      return (
                        <td key={crit.id} style={{ textAlign: 'center' }}>
                          {scoreVal !== undefined ? (
                            <span style={{ fontWeight: '600' }}>{scoreVal}</span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                          )}
                        </td>
                      );
                    })}
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'center' }}>
                        <button
                          className="btn-primary-spk"
                          style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', borderRadius: '6px' }}
                          onClick={() => handleOpenInput(emp)}
                          disabled={criteria.length === 0}
                        >
                          Input Nilai
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && selectedEmp && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.1rem' }}>Evaluasi Kinerja Karyawan</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Karyawan: <strong>{selectedEmp.name}</strong> (ID: {selectedEmp.id})
                </span>
              </div>
              <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {criteria.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    Harap tambah kriteria di modul kriteria terlebih dahulu.
                  </p>
                ) : (
                  criteria.map((crit) => (
                    <div className="form-group" key={crit.id}>
                      <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>
                          {crit.code} - {crit.name}
                        </span>
                        <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                          ({crit.attribute}, {crit.unit})
                        </span>
                      </label>
                      <div className="input-wrapper">
                        <input
                          type="number"
                          step="any"
                          min="0"
                          placeholder={`Masukkan nilai (${crit.unit})...`}
                          value={formValues[crit.code] !== undefined ? formValues[crit.code] : ''}
                          onChange={(e) => handleInputChange(crit.code, e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  ))
                )}
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
