import { BaseService } from './BaseService';

export class EntityService extends BaseService {
  constructor(endpoint) {
    super();
    this.endpoint = endpoint;
  }

  async list() {
    return this.get(`${this.endpoint}/list`);
  }

  async create(data) {
    return this.post(this.endpoint, data);
  }

  async remove(id) {
    return this.delete(`${this.endpoint}/${id}`);
  }
}

export const DisciplineService = new EntityService('/disciplina');
export const TagService = new EntityService('/tag');
