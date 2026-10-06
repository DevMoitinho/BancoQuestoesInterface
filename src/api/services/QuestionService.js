import { BaseService } from './BaseService';

export class QuestionService extends BaseService {
  async search(payload) {
    return this.post('/questao/pesquisa', payload);
  }

  async save(data) {
    if (data.id) {
      return this.put(`/questao/${data.id}`, data);
    }
    return this.post('/questao', data);
  }

  async remove(id) {
    return this.delete(`/questao/${id}`);
  }

  async generateExam(disciplinaId, size) {
    return this.get(`/questao/${disciplinaId}-${size}`);
  }
}

export const questionService = new QuestionService();
