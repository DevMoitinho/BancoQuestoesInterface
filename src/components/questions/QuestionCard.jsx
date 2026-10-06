import React from 'react';

const QuestionCard = ({ question, onEdit, onDelete }) => {
  return (
    <div className="question-card">
      <div className="question-enunciado">{question.enunciado}</div>
      <div className="question-alternatives">
        {question.alternativas?.map((a, i) => (
          <div key={i} className="alt-item">
            <span className="alt-letter">{String.fromCharCode(97 + i)})</span> {a.enunciado}
          </div>
        ))}
      </div>
      <div className="question-actions">
        <button className="btn-edit" onClick={() => onEdit(question)}>Edit</button>
        <button className="btn-delete" onClick={() => onDelete(question.id)}>Delete</button>
      </div>
    </div>
  );
};

export default QuestionCard;
