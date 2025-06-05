import axios from "axios";

const API_URL = "http://localhost:5000/api/teacher/all";

export const getAllTeachers = async () => {
  const res = await axios.get(`${API_URL}`);
  // Filter only users with role 'teacher'
  return res.data.filter((user) => user.role === "teacher");
};
