import React, { useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/ExamPage.css';

const ExamPage = () => {
  const [disciplines, setDisciplines] = useState([]);
  const [selectedDisciplina, setSelectedDisciplina] = useState('');
  const [size, setSize] = useState(5);
  const [exam, setExam] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDisciplines = async () => {
      try {
        const res = await api.get('/disciplina/list');
        setDisciplines(res.data);
      } catch (err) {
        console.error('Error fetching disciplines', err);
      }
    };
    fetchDisciplines();
  }, []);

  const handleGenerate = async () => {
    setError('');
    setExam(null);
    setLoading(true);
    try {
      const res = await api.get(`/questao/${selectedDisciplina}-${size}`);
      setExam(res.data);
    } catch (err) {
      setError(err.response?.data || 'Error generating exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exam-page">
      <nav className="exam-nav">
        <h2>Gerar Prova</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/questions')}>Manage Questions</button>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="exam-container">
        <div className="config-card">
          <h3>Configurações da Prova</h3>
          <div className="exam-input-group">
            <div className="input-field">
              <label>Disciplina:</label>
              <select value={selectedDisciplina} onChange={e => setSelectedDisciplina(e.target.value)} required>
                <option value="">Select Discipline</option>
                {disciplines.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
              </select>
            </div>

            <div className="input-field">
              <label>Quantidade de Questões:</label>
              <input
                type="number"
                value={size}
                onChange={e => setSize(e.target.value)}
                min="1"
              />
            </div>

            <button className="btn-generate" onClick={handleGenerate} disabled={loading}>
              {loading ? 'Gerando...' : 'Gerar Prova'}
            </button>
          </div>
          {error && <p className="exam-error">{error}</p>}
        </div>

        {exam && (
          <div className="exam-print-area">
            <div className="exam-paper">
              <div className="exam-header">
                <div className="exam-header-main">
                  <h2>PROVA DE {disciplines.find(d => d.id === selectedDisciplina)?.nome || 'DISCIPLINA'}</h2>
                  <p>Professor: Arthur</p>
                </div>
                <div className="exam-header-student">
                  <div className="student-field">Aluno(a): _________________________________________________</div>
                  <div className="student-field">Data: ___/___/___  Turma: _________</div>
                </div>
              </div>

              <div className="exam-questions-list">
                {exam.map((q, i) => (
                  <div key={i} className="exam-question">
                    <p className="question-text"><strong>{i + 1}.</strong> {q.enunciado}</p>
                    <ul className="exam-alternatives">
                      {q.alternativas?.map((a, j) => (
                        <li key={j} className="exam-alt-item">
                          <span className="exam-alt-letter">{String.fromCharCode(97 + j)})</span> {a.enunciado}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="exam-actions">
              <button className="btn-print" onClick={() => window.print()}>Imprimir Prova</button>
              <button className="btn-reset" onClick={() => setExam(null)}>Limpar Prova</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamPage;
