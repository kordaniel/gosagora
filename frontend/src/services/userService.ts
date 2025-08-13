import axiosInstance from '../modules/axiosInstance';

const apiBasePath = '/api/v1/user';

const deleteOne = async (userId: string): Promise<void> => {
  await axiosInstance.delete(`${apiBasePath}/${userId}`);
};

export default {
  deleteOne,
};
