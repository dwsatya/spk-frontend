import React, { useState, useEffect, useCallback } from 'react';
import {
  getCriteria,
  createCriteria,
  updateCriteria,
  deleteCriteria,
  unwrapList,
  getApiError,
} from '../services/api';

export default function Criteria() {
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedCrit, setSelectedCrit] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formAttribute, setFormAttribute] = useState('benefit');
  const [formWeight, setFormWeight] = useState('0.00');
  const [formUnit, setFormUnit] = useState('');

  const [totalWeight, setTotalWeight] = useState(0);
  const [isWeightValid, setIsWeightValid] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCriteria = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCriteria();
      setCriteria(unwrapList(res));
    } catch (err) {
      showToast(getApiError(err, 'Gagal memuat data kriteria.'), 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCriteria();
  }, [fetchCriteria]);

  useEffect(() => {
    const sum = criteria.reduce((acc, curr) => acc + (parseFloat(curr.weight) || 0), 0);
    const roundedSum = Math.round(sum * 10000) / 10000;
    setTotalWeight(roundedSum);
    setIsWeightValid(Math.abs(roundedSum - 1.0) < 0.001);
  }, [criteria]);

  const handleOpenAdd = () => {
    setModalType('add');
    const nextNum =
      criteria.length > 0
        ? Math.max(...criteria.map((c) => parseInt(c.code.replace('C', ''), 10) || 0)) + 1
        : 1;
    setFormCode(`C${nextNum}`);
    setFormName('');
    setFormAttribute('benefit');
    setFormWeight('0.00');
    setFormUnit('');
    setModalOpen(true);
  };

  const handleOpenEdit = (crit) => {
    setSelectedCrit(crit);
    setModalType('edit');
    setFormCode(crit.code);
    setFormName(crit.name);
    setFormAttribute(crit.attribute);
    setFormWeight(String(crit.weight));
    setFormUnit(crit.unit || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formCode || !formName || formWeight === '' || !formUnit) {
      showToast('Semua kolom wajib diisi!', 'error');
      return;
    }

    const payload = {
      code: formCode,
      name: formName,
      weight: parseFloat(formWeight) || 0,
      unit: formUnit,
      attribute: formAttribute,
    };

    setSubmitting(true);
    try {
      if (modalType === 'add') {
        await createCriteria(payload);
        showToast('Kriteria dan bobot baru berhasil ditambahkan!');
      } else {
        await updateCriteria(selectedCrit.id, payload);
        showToast('Detail kriteria dan bobot berhasil diperbarui!');
      }
      setModalOpen(false);
      fetchCriteria();
    } catch (err) {
      showToast(getApiError(err), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus kriteria "${name}"?`)) return;

    try {
      await deleteCriteria(id);
      showToast(`Kriteria "${name}" telah dihapus.`);
      fetchCriteria();
    } catch (err) {
      showToast(getApiError(err), 'error');
    }
  };

  const filteredCriteria = criteria.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.attribute.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Kriteria & Bobot Penilaian</h1>
        <p className="page-subtitle">
          Kelola kriteria keputusan beserta bobot nilai desimal. Akumulasi total seluruh bobot kriteria wajib bernilai tepat 1.00.
        </p>
      </div>

      <div className={`weight-validation-box ${isWeightValid ? 'weight-validation-box--success' : 'weight-validation-box--error'}`}>
        <div className="validation-icon">
          {isWeightValid ? (
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </div>
        <div className="validation-details">
          <strong>
            {isWeightValid
              ? `Total Bobot Valid (Total: ${totalWeight.toFixed(2)})`
              : `Total Bobot Tidak Valid (Total: ${totalWeight.toFixed(2)})`}
          </strong>
          <p>
            {isWeightValid
              ? 'Jumlah total bobot kriteria sudah tepat 1.00 (100%). Perhitungan peringkat WASPAS siap dijalankan.'
              : 'Jumlah seluruh bobot kriteria saat ini harus bernilai tepat 1.00 (100%). Silakan edit nilai bobot kriteria yang ada.'}
          </p>
        </div>
      </div>

      <div className="crud-actions">
        <div className="search-input-wrapper">
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Cari kriteria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-primary-spk" onClick={handleOpenAdd}>
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Tambah Kriteria
        </button>
      </div>

      <div className="table-container">
        <table className="spk-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>No</th>
              <th style={{ width: '100px' }}>Kode</th>
              <th>Nama Kriteria</th>
              <th style={{ width: '120px' }}>Satuan</th>
              <th style={{ width: '160px' }}>Sifat / Tipe</th>
              <th style={{ width: '160px', textAlign: 'center' }}>Bobot (Desimal)</th>
              <th style={{ width: '120px', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  Memuat data kriteria...
                </td>
              </tr>
            ) : filteredCriteria.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  Tidak ada data kriteria ditemukan
                </td>
              </tr>
            ) : (
              filteredCriteria.map((crit, idx) => (
                <tr key={crit.id}>
                  <td>{idx + 1}</td>
                  <td><strong>{crit.code}</strong></td>
                  <td>{crit.name}</td>
                  <td>{crit.unit}</td>
                  <td>
                    <span
                      className="badge-role"
                      style={{
                        color: crit.attribute === 'benefit' ? '#34d399' : '#f43f5e',
                        backgroundColor:
                          crit.attribute === 'benefit'
                            ? 'rgba(16, 185, 129, 0.08)'
                            : 'rgba(244, 63, 94, 0.08)',
                        borderColor: 'transparent',
                      }}
                    >
                      {crit.attribute}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: '700', color: 'var(--primary-light)' }}>
                    {parseFloat(crit.weight).toFixed(2)}
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      <button
                        className="btn-icon-action btn-icon-action--edit"
                        onClick={() => handleOpenEdit(crit)}
                        title="Edit Kriteria"
                      >
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button
                        className="btn-icon-action btn-icon-action--delete"
                        onClick={() => handleDelete(crit.id, crit.name)}
                        title="Hapus Kriteria"
                      >
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                          <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{modalType === 'add' ? 'Tambah Kriteria & Bobot' : 'Edit Kriteria & Bobot'}</h3>
              <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Kode Kriteria</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="Contoh: C1"
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Nama Kriteria</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="Masukkan nama kriteria..."
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Satuan</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="Contoh: Tahun, Persen, Hari"
                      value={formUnit}
                      onChange={(e) => setFormUnit(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Sifat Kriteria (Attribute)</label>
                  <div className="select-wrapper">
                    <select
                      value={formAttribute}
                      onChange={(e) => setFormAttribute(e.target.value)}
                      className="select-input"
                      style={{ paddingLeft: '1rem' }}
                    >
                      <option value="benefit">Benefit (Makin tinggi nilainya, makin baik)</option>
                      <option value="cost">Cost (Makin rendah nilainya, makin baik)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Bobot Nilai (Desimal)</label>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      placeholder="Contoh: 0.25"
                      value={formWeight}
                      onChange={(e) => setFormWeight(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary-spk"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                >
                  Batal
                </button>
                <button type="submit" className="btn-primary-spk" disabled={submitting}>
                  {submitting ? 'Menyimpan...' : modalType === 'add' ? 'Tambah Kriteria' : 'Simpan Perubahan'}
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
