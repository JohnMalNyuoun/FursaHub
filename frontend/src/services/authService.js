import api from './api';

export const youthRegister = async (data) => {
  const response = await api.post('/auth/youth/register', data);
  return response.data;
};

export const youthLogin = async (data) => {
  const response = await api.post('/auth/youth/login', data);
  return response.data;
};

export const orgRegister = async (data) => {
  const response = await api.post('/auth/org/register', data);
  return response.data;
};

export const orgLogin = async (data) => {
  const response = await api.post('/auth/org/login', data);
  return response.data;
};

export const orgReinstateRequest = async (data) => {
  const response = await api.post('/auth/org/reinstate-request', data);
  return response.data;
};