import api from './api';

export const updateReminders = async (settings) => {
  const response = await api.patch('/users/me/reminders', settings);
  return response.data;
};
