import axiosInstance from '../modules/axiosInstance';

const getHealth = async () => {
  const { data } = await axiosInstance.get<string>('/healthcheck');
  return data;
};

export default {
  getHealth,
};
