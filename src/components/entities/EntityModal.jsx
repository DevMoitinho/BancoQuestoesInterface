import React, { useState } from 'react';
import Modal from '../common/Modal';

const EntityModal = ({
  isOpen,
  onClose,
  onSave,
  entityLabel,
  entities = [],
  onDelete,
  manageMode = false
}) => {
  const [name, setName] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    onSave({ nome: name });
    setName('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={manageMode ? `Gerenciar ${entityLabel}s` : `Nova ${entityLabel}`}>
      {manageMode ? (
        <>
          <form onSubmit={handleSave} className="questions-form" style={{ marginBottom: '20px' }}>
            <input
              placeholder={`Nome da ${entityLabel.toLowerCase()}`}
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button type="submit">Salvar</button>
              <button type="button" onClick={onClose}>Cancelar</button>
            </div>
          </form>
          <ul className="disciplines-manage-list">
            {entities.map(e => (
              <li key={e.id} className="discipline-manage-item">
                <span>{e.nome}</span>
                <button className="btn-delete" onClick={() => onDelete(e.id)}>Remover</button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <form onSubmit={handleSave} className="questions-form">
          <input
            placeholder={`Nome da ${entityLabel.toLowerCase()}`}
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button type="submit">Salvar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default EntityModal;
