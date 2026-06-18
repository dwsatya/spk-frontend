import React, { useState, useEffect, useCallback } from 'react';
import {
  getUsers,
  register,
  updateUser,
  deleteUser,
  unwrapList,
  getApiError,
} from '../services/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedUser, setSelectedUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState('hrd');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(unwrapList(res));
    } catch (err) {
      showToast(getApiError(err, 'Gagal memuat data pengguna.'), 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenAdd = () => {
    setModalType('add');
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormRole('hrd');
    setModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setModalType('edit');
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPassword('');
    setFormRole(user.role);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName || (modalType === 'add' && (!formEmail || !formPassword))) {
      showToast('Harap isi semua kolom wajib!', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (modalType === 'add') {
        await register(formName, formEmail, formPassword, formRole);
        showToast('Pengguna baru berhasil ditambahkan!');
      } else {
        await updateUser(selectedUser.id, { name: formName, role: formRole });
        showToast('Detail pengguna berhasil diperbarui!');
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      showToast(getApiError(err), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus pengguna "${name}"?`)) return;

    try {
      await deleteUser(id);
      showToast(`Pengguna "${name}" berhasil dihapus.`);
      fetchUsers();
    } catch (err) {
      showToast(getApiError(err), 'error');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Manajemen Pengguna</h1>
        <p className="page-subtitle">Kelola akun pengguna, email, dan hak akses aktor sistem</p>
      </div>

      <div className="crud-actions">
        <div className="search-input-wrapper">
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Cari pengguna..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-primary-spk" onClick={handleOpenAdd}>
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Tambah Pengguna
        </button>
      </div>

      <div className="table-container">
        <table className="spk-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Lengkap</th>
              <th>Email</th>
              <th>Hak Akses / Role</th>
              <th style={{ width: '120px', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  Memuat data pengguna...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  Tidak ada data pengguna ditemukan
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => (
                <tr key={user.id}>
                  <td>{idx + 1}</td>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge-role badge-role--${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      <button
                        className="btn-icon-action btn-icon-action--edit"
                        onClick={() => handleOpenEdit(user)}
                        title="Edit User"
                      >
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button
                        className="btn-icon-action btn-icon-action--delete"
                        onClick={() => handleDelete(user.id, user.name)}
                        title="Hapus User"
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
              <h3>{modalType === 'add' ? 'Tambah Pengguna Baru' : 'Edit Detail Pengguna'}</h3>
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
                  <label>Nama Lengkap</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap..."
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      placeholder="Contoh: user@domain.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      required={modalType === 'add'}
                      disabled={modalType === 'edit'}
                    />
                  </div>
                  {modalType === 'edit' && (
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      Email tidak dapat diubah melalui sistem.
                    </small>
                  )}
                </div>

                {modalType === 'add' && (
                  <div className="form-group">
                    <label>Password</label>
                    <div className="input-wrapper">
                      <input
                        type="password"
                        placeholder="Masukkan password akun..."
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Aktor / Role Akses</label>
                  <div className="select-wrapper">
                    <select
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      className="select-input"
                      style={{ paddingLeft: '1rem' }}
                    >
                      <option value="admin">Admin (Akses Penuh)</option>
                      <option value="manager">Manager (Kriteria, Peringkat)</option>
                      <option value="hrd">HRD (Karyawan, Nilai, Peringkat)</option>
                      <option value="user">User</option>
                    </select>
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
                  {submitting ? 'Menyimpan...' : modalType === 'add' ? 'Tambah Pengguna' : 'Simpan Perubahan'}
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
