import { useState, useEffect } from 'react';
import { questionService } from '../api/services/QuestionService';

export function useQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await questionService.search(filters);
      setQuestions(data);
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const saveQuestion = async (formData) => {
    try {
      await questionService.save(formData);
      await fetchQuestions();
    } catch (err) {
      console.error('Error saving question:', err);
      throw err;
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await questionService.remove(id);
      await fetchQuestions();
    } catch (err) {
      console.error('Error deleting question:', err);
      throw err;
    }
  };

  return { questions, loading, fetchQuestions, saveQuestion, deleteQuestion };
}
