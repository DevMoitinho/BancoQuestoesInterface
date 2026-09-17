import React, { useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/QuestionsPage.css';

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [filterDisciplina, setFilterDisciplina] = useState('');
  const [formData, setFormData] = useState({ enunciado: '', disciplinaId: '', alternativas: [] });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisciplinaModalOpen, setIsDisciplinaModalOpen] = useState(false);
  const [newDisciplinaName, setNewDisciplinaName] = useState('');
  const [altText, setAltText] = useState('');
  const [altCorrect, setAltCorrect] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDisciplines();
  }, []);

  useEffect(() => {
    fetchQuestions(filterDisciplina);
  }, [filterDisciplina]);

  const fetchDisciplines = async () => {
    try {
      const res = await api.get('/disciplina/list');
      setDisciplines(res.data);
    } catch (err) {
      console.error('Error fetching disciplines', err);
    }
  };

  const fetchQuestions = async (disciplinaId = '') => {
    try {
      const endpoint = disciplinaId ? `/questao/list/${disciplinaId}` : '/questao/list';
      const res = await api.get(endpoint);
      setQuestions(res.data);
    } catch (err) {
      console.error('Error fetching questions', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/questao/${editingId}`, formData);
      } else {
        await api.post('/questao', formData);
      }
      setFormData({ enunciado: '', disciplinaId: '', alternativas: [] });
      setEditingId(null);
      setIsModalOpen(false);
      fetchQuestions(filterDisciplina);
    } catch (err) {
      alert('Error saving question');
    }
  };

  const handleAddAlt = () => {
    setFormData({ ...formData, alternativas: [...formData.alternativas, { enunciado: altText, correta: altCorrect }] });
    setAltText('');
    setAltCorrect(false);
  };

  const handleRemoveAlt = (index) => {
    setFormData({
      ...formData,
      alternativas: formData.alternativas.filter((_, i) => i !== index),
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/questao/${id}`);
        fetchQuestions(filterDisciplina);
      } catch (err) {
        alert('Error deleting question');
      }
    }
  };

  const handleCreateDisciplina = () => {
    setNewDisciplinaName('');
    setIsDisciplinaModalOpen(true);
  };

  const handleSaveDisciplina = async (e) => {
    e.preventDefault();
    try {
      await api.post('/disciplina', { nome: newDisciplinaName });
      setIsDisciplinaModalOpen(false);
      setNewDisciplinaName('');
      fetchDisciplines();
    } catch (err) {
      alert('Error creating discipline');
    }
  };

  const startEdit = (q) => {
    setEditingId(q.id);
    setFormData({
      enunciado: q.enunciado,
      disciplinaId: q.disciplinaId,
      alternativas: q.alternativas || [],
    });
    setIsModalOpen(true);
  };

  return (
    <div>
      <nav className="questions-nav">
        <h2>Banco Questões</h2>
        <h3>prof. Arthur</h3>
        <div style={{ display: 'flex', gap: '10px' }}>

          <button onClick={() => navigate('/exam')}>Gerar Prova</button>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>
      <div className="questions-container">
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => { if (!editingId) { setFormData({ enunciado: '', disciplinaId: '', alternativas: [] }); } setIsModalOpen(false); setEditingId(null); }}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>{editingId ? 'Edit' : 'Create'} Question</h3>
              <form onSubmit={handleSave} className="questions-form">
                <input
                  placeholder="Enunciado"
                  value={formData.enunciado}
                  onChange={e => setFormData({...formData, enunciado: e.target.value})}
                  required
                />
                <select
                  value={formData.disciplinaId}
                  onChange={e => setFormData({...formData, disciplinaId: e.target.value})}
                  required
                >
                  <option value="">Select Discipline</option>
                  {disciplines.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                </select>

                <div className="alt-container">
                  <h4>Alternatives</h4>
                  <div className="alt-input-group">
                    <input
                      placeholder="Alt text"
                      value={altText}
                      onChange={e => setAltText(e.target.value)}
                    />
                    <label>
                      <input type="checkbox" checked={altCorrect} onChange={e => setAltCorrect(e.target.checked)} /> Correct
                    </label>
                    <button type="button" onClick={handleAddAlt}>Add</button>
                  </div>
                  <ul className="form-alt-list">
                    {formData.alternativas.map((a, i) => (
                      <li key={i} className="form-alt-item">
                        <span>{a.enunciado} {a.correta ? '(Correct)' : ''}</span>
                        <button
                          type="button"
                          className="btn-remove-alt"
                          onClick={() => handleRemoveAlt(i)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <button type="submit">Save Question</button>
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingId(null); setFormData({ enunciado: '', disciplinaId: '', alternativas: [] }); }}>Cancel</button>
              </form>
            </div>
          </div>
        )}

        {isDisciplinaModalOpen && (
          <div className="modal-overlay" onClick={() => setIsDisciplinaModalOpen(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>Nova Disciplina</h3>
              <form onSubmit={handleSaveDisciplina} className="questions-form">
                <input
                  placeholder="Nome da Disciplina"
                  value={newDisciplinaName}
                  onChange={e => setNewDisciplinaName(e.target.value)}
                  required
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button type="submit">Salvar</button>
                  <button type="button" onClick={() => setIsDisciplinaModalOpen(false)}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <h3>List of Questions</h3>
        <div className="filter-container">
          <button className="btn-new-question" onClick={() => { setFormData({ enunciado: '', disciplinaId: '', alternativas: [] }); setEditingId(null); setIsModalOpen(true); }}>Nova Questão</button>
          <button className="btn-new-discipline" onClick={handleCreateDisciplina}>Nova Disciplina</button>
          <label htmlFor="discipline-filter">Filtrar por Disciplina:</label>
          <select
            id="discipline-filter"
            value={filterDisciplina}
            onChange={e => setFilterDisciplina(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas as Disciplinas</option>
            {disciplines.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
          </select>
        </div>
        <div className="questions-list">
          {questions.map((q) => (
            <div key={q.id} className="question-card">
              <div className="question-enunciado">{q.enunciado}</div>
              <div className="question-alternatives">
                {q.alternativas?.map((a, i) => (
                  <div key={i} className="alt-item">
                    <span className="alt-letter">{String.fromCharCode(97 + i)})</span> {a.enunciado}
                  </div>
                ))}
              </div>
              <div className="question-actions">
                <button className="btn-edit" onClick={() => startEdit(q)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(q.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;
