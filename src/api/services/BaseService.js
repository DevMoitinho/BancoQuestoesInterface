import api from '../api';
import { startLoading, stopLoading } from '../loadingBridge';

export class BaseService {
  async get(url) {
    startLoading();
    try {
      const response = await api.get(url);
      return response.data;
    } finally {
      stopLoading();
    }
  }

  async post(url, data) {
    startLoading();
    try {
      const response = await api.post(url, data);
      return response.data;
    } finally {
      stopLoading();
    }
  }

  async put(url, data) {
    startLoading();
    try {
      const response = await api.put(url, data);
      return response.data;
    } finally {
      stopLoading();
    }
  }

  async delete(url) {
    startLoading();
    try {
      const response = await api.delete(url);
      return response.data;
    } finally {
      stopLoading();
    }
  }
}
