import api from './api';

export const createInvite = async (eventId) => {
  const response = await api.post('/invites', { eventId });
  return response.data;
};

export const getInvite = async (token) => {
  const response = await api.get(`/invites/${token}`);
  return response.data;
};

export const clickInvite = async (token) => {
  const response = await api.post(`/invites/${token}/click`);
  return response.data;
};
