// userApi.ts
import api from './apiService';

export const getUser = () => {
  return api.get('/user');
};

export const deleteUser = (userId: number) => {
  return api.delete(`/user/${userId}`);
};
