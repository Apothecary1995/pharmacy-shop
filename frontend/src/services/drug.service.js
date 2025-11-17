import api from "./api";

const getAllDrugs = () => {
  return api.get("/api/drugs");
};

const getDrugById = (id) => {
  return api.get(`/api/drugs/${id}`);
};

const drugService = { getAllDrugs, getDrugById };
export default drugService;