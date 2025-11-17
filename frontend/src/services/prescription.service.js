import api from "./api";

const uploadPrescription = (formData) => {
  return api.post("/api/prescriptions/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// --- Admin ---
const getPendingPrescriptions = () => {
  return api.get("/api/prescriptions/pending");
};

const updatePrescriptionStatus = (prescriptionId, status) => {
  return api.put("/api/prescriptions/status", { prescriptionId, status });
};

const prescriptionService = { uploadPrescription, getPendingPrescriptions, updatePrescriptionStatus };
export default prescriptionService;