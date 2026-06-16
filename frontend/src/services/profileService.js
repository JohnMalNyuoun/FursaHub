import api from './api';

export const getYouthProfile = async () => {
  const response = await api.get('/youth/profile');
  return response.data;
};

export const getOrgProfile = async () => {
  const response = await api.get('/org/profile');
  return response.data;
};

export const updateYouthLanguage = async (language) => {
  const response = await api.put('/youth/profile/language', { language });
  return response.data;
};

export const updateOrgLanguage = async (language) => {
  const response = await api.put('/org/profile/language', { language });
  return response.data;
};
