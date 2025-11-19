import React, { useState, useEffect } from 'react';
import DrugItem from './DrugItem';
import drugService from '../../services/drug.service';

const DrugList = ({ onDrugSelect }) => {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await drugService.getAllDrugs();
        setDrugs(response.data);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchDrugs();
  }, []);

  if (loading) return <p>Loading products</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="drug-grid">
      {drugs.map(drug => (
        <DrugItem key={drug.id} drug={drug} onDrugSelect={onDrugSelect} />
      ))}
    </div>
  );
};

export default DrugList;