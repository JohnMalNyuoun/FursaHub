import api from './api';

export const getAllCourses = async (params) => {
  const response = await api.get('/youth/courses', { params });
  return response.data;
};

export const getCourse = async (id) => {
  const response = await api.get(`/youth/courses/${id}`);
  return response.data;
};

export const getOrgCourses = async () => {
  const response = await api.get('/org/courses');
  return response.data;
};

export const createCourse = async (data) => {
  const response = await api.post('/org/courses', data);
  return response.data;
};

export const publishCourse = async (id) => {
  const response = await api.put(`/org/courses/${id}/publish`);
  return response.data;
};

export const closeCourse = async (id) => {
  const response = await api.put(`/org/courses/${id}/close`);
  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await api.delete(`/org/courses/${id}`);
  return response.data;
};