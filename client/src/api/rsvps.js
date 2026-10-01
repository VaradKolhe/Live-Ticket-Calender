import api from './api';

export const createRSVP = async (eventData) => {
  const response = await api.post('/rsvps', eventData);
  return response.data;
};

export const getRSVPs = async () => {
  const response = await api.get('/rsvps');
  return response.data;
};

export const deleteRSVP = async (eventId) => {
  const response = await api.delete(`/rsvps/${eventId}`);
  return response.data;
};
