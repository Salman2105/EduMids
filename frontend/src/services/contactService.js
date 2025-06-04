import axios from 'axios';

export const sendContactMessage = async (data) => {
  return axios.post('http://localhost:5000/api/contact', data);
};
