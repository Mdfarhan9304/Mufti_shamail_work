import axiosInstance from "../config/axios.config";
import { User } from "../contexts/AuthContext";

type UpdatedUser = Partial<User>;

export const updateUserProfile = async (updatedUser: UpdatedUser) => {
  const { name, email, phone, addresses, _id: userId } = updatedUser;
  const response = await axiosInstance.put(`/users/profile/${userId}`, {
    name: name,
    email: email,
    address: addresses,
    phone: phone,
  });
  return response.data;
};
