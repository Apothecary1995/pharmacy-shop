// frontend/src/services/drug.service.js (GÜNCELLENDİ)

import api from "./api";

// getAllDrugs fonksiyonu artık filtreleri kabul ediyor
const getAllDrugs = (filters = {}) => { 
  let url = "/api/drugs";
  const params = [];

  if (filters.searchQuery && filters.searchQuery.trim() !== '') {
    params.push(`search=${encodeURIComponent(filters.searchQuery.trim())}`);
  }
  
  // Kategori 'All' değilse filtreye ekle
  if (filters.category && filters.category !== 'All') {
    params.push(`category=${encodeURIComponent(filters.category)}`);
  }
  
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  
  return api.get(url);
};

const getDrugById = (id) => {
  return api.get(`/api/drugs/${id}`);
};

const drugService = { getAllDrugs, getDrugById };
export default drugService;