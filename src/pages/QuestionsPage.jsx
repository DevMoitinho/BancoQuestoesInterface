import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useQuestions } from '../hooks/useQuestions';
import { useEntities } from '../hooks/useEntities';
import { DisciplineService, TagService } from '../api/services/EntityService';
import QuestionForm from '../components/questions/QuestionForm';
import QuestionCard from '../components/questions/QuestionCard';
import EntityModal from '../components/entities/EntityModal';
import '../styles/QuestionsPage.css';

const QuestionsPage = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Hooks for state and logic
  const { questions, fetchQuestions, saveQuestion, deleteQuestion } = useQuestions();
  const {
    entities: disciplines,
    createEntity: createDisciplina,
    deleteEntity: deleteDisciplina
  } = useEntities(DisciplineService, 'Disciplina');

  const {
    entities: tags,
    createEntity: createTag,
    deleteEntity: deleteTag
  } = useEntities(TagService, 'Tag');

  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDisciplina, setFilterDisciplina] = useState('');
  const [filterTags, setFilterTags] = useState([]);

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [isDisciplinaModalOpen, setIsDisciplinaModalOpen] = useState(false);
  const [isManageDisciplinaModalOpen, setIsManageDisciplinaModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isManageTagModalOpen, setIsManageTagModalOpen] = useState(false);

  useEffect(() => {
    fetchQuestions({
      pesquisa: searchTerm,
      disciplinaId: filterDisciplina,
      tags: filterTags
    });
  }, [filterDisciplina, searchTerm, filterTags]);

  const handleSearch = () => {
    fetchQuestions({ pesquisa: searchTerm });
  };

  const handleSaveQuestion = async (formData) => {
    try {
      await saveQuestion(formData);
      setIsQuestionModalOpen(false);
      setEditingQuestion(null);
    } catch (err) {
      alert('Error saving question');
    }
  };

  const handleStartEdit = (q) => {
    setEditingQuestion({
      ...q,
      tagsIds: q.tags?.map(t => t.id) || [],
    });
    setIsQuestionModalOpen(true);
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
        <QuestionForm
          isOpen={isQuestionModalOpen}
          onClose={() => { setIsQuestionModalOpen(false); setEditingQuestion(null); }}
          onSave={handleSaveQuestion}
          initialData={editingQuestion || { enunciado: '', disciplinaId: '', tagsIds: [], alternativas: [] }}
          disciplines={disciplines}
          tags={tags}
        />


        <EntityModal
          isOpen={isManageDisciplinaModalOpen}
          onClose={() => setIsManageDisciplinaModalOpen(false)}
          onSave={createDisciplina}
          onDelete={deleteDisciplina}
          entities={disciplines}
          entityLabel="Disciplina"
          manageMode={true}
        />

        <EntityModal
          isOpen={isManageTagModalOpen}
          onClose={() => setIsManageTagModalOpen(false)}
          onSave={createTag}
          onDelete={deleteTag}
          entities={tags}
          entityLabel="Tag"
          manageMode={true}
        />

        <h3>List of Questions</h3>
        <div className="filter-container">
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <button className="btn-new-question" onClick={() => { setEditingQuestion(null); setIsQuestionModalOpen(true); }}>Nova Questão</button>
            
            <button className="btn-manage-disciplines" onClick={() => setIsManageDisciplinaModalOpen(true)}>Gerenciar Disciplinas</button>
            <button className="btn-manage-tags" onClick={() => setIsManageTagModalOpen(true)}>Gerenciar Tags</button>
          </div>
          <div className="search-group" style={{ width: '100%', marginBottom: '10px', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Pesquisar questão..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ flex: 1 }}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
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
          <label htmlFor="tag-filter">Filtrar por Tag:</label>
          <select
            id="tag-filter"
            value={filterTags[0] || ''}
            onChange={e => setFilterTags(e.target.value ? [Number(e.target.value)] : [])}
            className="filter-select"
          >
            <option value="">Todas as Tags</option>
            {tags.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
        </div>
        <div className="questions-list">
          {questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              onEdit={handleStartEdit}
              onDelete={deleteQuestion}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;
