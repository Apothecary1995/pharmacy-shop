import React, { useState, useEffect } from 'react';
import prescriptionService from '../../services/prescription.service';

const PendingPrescriptions = ({ onUpdate }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await prescriptionService.getPendingPrescriptions();
      setPrescriptions(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetchPending();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await prescriptionService.updatePrescriptionStatus(id, status);
      fetchPending(); // Listeyi yenile
      onUpdate(); // AdminDashboardPage'i uyar
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return <p>Loading pending prescriptions</p>;

  return (
    <div className="admin-section">
      <h3>Pending Prescriptions</h3>
      <div className="prescription-list">
        {prescriptions.length === 0 ? <p>No pending prescriptions</p> : (
          prescriptions.map(p => (
            <div key={p.id} className="prescription-item">
              <p><strong>ID:</strong> {p.id} | <strong>User:</strong> {p.user.email}</p>
              <a href={`${API_URL}/${p.imageUrl.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer">
                <img src={`${API_URL}/${p.imageUrl.replace(/\\/g, '/')}`} alt="Prescription" style={{width: '100%', maxWidth: '400px'}} />
              </a>
              <div style={{marginTop: '10px'}}>
                <button onClick={() => handleStatusUpdate(p.id, 'approved')} className="btn btn-success">Approve</button>
                <button onClick={() => handleStatusUpdate(p.id, 'rejected')} className="btn btn-danger" style={{marginLeft: '10px'}}>Reject</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PendingPrescriptions;