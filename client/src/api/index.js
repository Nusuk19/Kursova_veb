import axios from 'axios';
const url = 'http://localhost:5000'

export const registerUser = async (data) => {
    try {
      console.log("Data being sent:", data); 
      const response = await axios.post('http://localhost:5000/auth/register', data, {
        headers: {
          'Content-Type': 'application/json', 
        }
      });
      return response.data;
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      throw error; 
    }
  };

export const loginUser = async (data) => {
    console.log(data)
    const response = await axios.post(`${url}/auth/login`, data);
    return response.data;
}

export const resetPassword = async (data) => {
    console.log(data)
    const response = await axios.post(`${url}/auth/reset-password`, data);
    return response.data;
}

export const fetchUserProfile = async (userId) => {
  const response = await axios.get(`${url}/auth/user/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId, userData) => {
  const response = await axios.put(`${url}/auth/user/${userId}`, userData);
  return response.data;
};