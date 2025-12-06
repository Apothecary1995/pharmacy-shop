import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8081';

const authHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.accessToken) {
        return { 'x-access-token': user.accessToken };
    } else {
        return {};
    }
};

const uploadPrescription = (formData) => {
    
    return axios.post(`${API_URL}/api/prescriptions/upload`, formData, {
        headers: {
            ...authHeader(),
            "Content-Type": "multipart/form-data",
        },
    });
};

const getPendingPrescriptions = () => {
  
    return axios.get(`${API_URL}/api/prescriptions/pending`, { headers: authHeader() });
};

const updatePrescriptionStatus = (id, status) => {
    
    return axios.put(
        `${API_URL}/api/prescriptions/status`,
        { prescriptionId: id, status: status }, 
        { headers: authHeader() }
    );
};

const prescriptionService = {
    uploadPrescription,
    getPendingPrescriptions,
    updatePrescriptionStatus
};

export default prescriptionService;
