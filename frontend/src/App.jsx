import { useEffect, useState } from 'react';
import { request } from './api.js';

const PAGE_SIZE = 20;
const EMPTY_FORM = { title: '', author: '', sourceType: 'book', summary: '' };

export default function App() {
  const [books, setBooks] = useState([]);
  const [offset, setOffset] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadBooks(nextOffset = offset) {
    try {
      setError('');
      const body = await request(?limit=&offset=);
      setBooks(body.data || []);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { loadBooks(offset); }, [offset]);

  async function save(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    const path = editingId ? / : '';
    try {
      const body = await request(path, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setMessage(บันทึกแล้ว:  (id: ));
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadBooks(offset);
    } catch (err) {
      setError(err.message);
    }
  }

  async function startEdit(id) {
    setMessage('');
    setError('');
    try {
      const body = await request(/);
      const book = body.data;
      setEditingId(book.id);
      setForm({ title: book.title, author: book.author, sourceType: book.sourceType, summary: book.summary });
    } catch (err) {
      setError(err.message);
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
  }

  async function removeBook(book) {
    if (!window.confirm(ยืนยันการลบ ""?)) return;
    setMessage('');
    setError('');
    try {
      await request(/, { method: 'DELETE' });
      setMessage(ลบแล้ว:  (id: ));
      if (editingId === book.id) cancelEdit();
      await loadBooks(offset);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container">
      <h1>Course Book Explorer</h1>
      <p className="subtitle">รายการหนังสือเชื่อม Express API และ MongoDB Atlas</p>
      <section className="panel">
        <h2>{editingId ? 'แก้ไขหนังสือ' : 'เพิ่มหนังสือ'}</h2>
        <form onSubmit={save} className="form-grid">
          <label>ชื่อหนังสือ<input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></label>
          <label>ผู้แต่ง<input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required /></label>
          <label>ประเภทแหล่งอ่าน
            <select value={form.sourceType} onChange={e => setForm({ ...form, sourceType: e.target.value })}>
              <option value="book">หนังสือ (book)</option>
              <option value="documentation">เอกสารอ้างอิง (documentation)</option>
              <option value="course">รายวิชา (course)</option>
            </select>
          </label>
          <label>สรุป<textarea rows={3} value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} required /></label>
          <div className="actions">
            <button type="submit">{editingId ? 'บันทึกการแก้ไข' : 'เพิ่มหนังสือ'}</button>
            {editingId && <button type="button" className="secondary" onClick={cancelEdit}>ยกเลิกการแก้ไข</button>}
          </div>
        </form>
        {message && <p className="status">{message}</p>}
        {error && <p className="error">{error}</p>}
      </section>
      <div className="pagination">
        <button type="button" className="secondary" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}>ก่อนหน้า</button>
        <span>แสดงรายการที่ {offset + 1} – {offset + books.length}</span>
        <button type="button" className="secondary" disabled={books.length < PAGE_SIZE} onClick={() => setOffset(offset + PAGE_SIZE)}>ถัดไป</button>
      </div>
      <section className="book-list">
        {books.map(book => (
          <article key={book.id} className="book-card">
            <h3>{book.title}</h3>
            <div className="meta">ผู้แต่ง: {book.author} • ประเภท: {book.sourceType} • ID: {book.id}</div>
            <p>{book.summary}</p>
            <div className="actions">
              <button type="button" className="secondary" onClick={() => startEdit(book.id)}>อ่านและแก้ไข</button>
              <button type="button" className="danger" onClick={() => removeBook(book)}>ลบ</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
