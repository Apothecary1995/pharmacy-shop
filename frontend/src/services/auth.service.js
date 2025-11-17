import api from "./api";

const register = (username, email, password) => {
  return api.post("/api/auth/register", { username, email, password });
};

const login = async (email, password) => {
  const response = await api.post("/api/auth/login", { email, password });
  if (response.data.accessToken) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const authService = { register, login, logout, getCurrentUser };
export default authService;