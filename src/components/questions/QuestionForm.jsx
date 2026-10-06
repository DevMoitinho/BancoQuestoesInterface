import React, { useState } from 'react';

const QuestionForm = ({
  isOpen,
  onClose,
  onSave,
  initialData = { enunciado: '', disciplinaId: '', tagsIds: [], alternativas: [] },
  disciplines = [],
  tags = []
}) => {
  const [formData, setFormData] = useState(initialData);
  const [altText, setAltText] = useState('');
  const [altCorrect, setAltCorrect] = useState(false);

  // Sync with initialData when modal opens/closes or data changes
  React.useEffect(() => {
    setFormData(initialData);
  }, [initialData, isOpen]);

  const handleAddAlt = () => {
    setFormData({
      ...formData,
      alternativas: [...formData.alternativas, { enunciado: altText, correta: altCorrect }]
    });
    setAltText('');
    setAltCorrect(false);
  };

  const handleRemoveAlt = (index) => {
    setFormData({
      ...formData,
      alternativas: formData.alternativas.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>{initialData.id ? 'Edit' : 'Create'} Question</h3>
        <form onSubmit={handleSubmit} className="questions-form">
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

          <div className="tags-selection" style={{ margin: '10px 0' }}>
            <h4>Tags</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', maxHeight: '100px', overflowY: 'auto', border: '1px solid #ccc', padding: '5px' }}>
              {tags.map(t => (
                <label key={t.id} style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <input
                  type="checkbox"
                  checked={formData.tagsIds.includes(t.id)}
                  onChange={e => {
                    const checked = e.target.checked;
                    setFormData(prev => ({
                      ...prev,
                      tagsIds: checked
                        ? [...prev.tagsIds, t.id]
                        : prev.tagsIds.filter(id => id !== t.id),
                    }));
                  }}
                /> {t.nome}
                </label>
              ))}
            </div>
          </div>

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
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;
