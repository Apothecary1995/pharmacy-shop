import React, { useState, useEffect } from 'react';
import DrugItem from './DrugItem';
import drugService from '../../services/drug.service';

const DrugList = ({ onDrugSelect, filters }) => {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await drugService.getAllDrugs(filters); 
        setDrugs(response.data);
      } catch (err) {
        console.error("Drug fetch error:", err); 
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    
    
    fetchDrugs(); 
    
  }, [filters]); 

  if (loading) return <p>Loading products</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  if (drugs.length === 0) {
    return <p>No products found matching catagory</p>;
  }

  return (
    <div className="drug-grid">
      {drugs.map(drug => (
        <DrugItem key={drug.id} drug={drug} onDrugSelect={onDrugSelect} />
      ))}
    </div>
  );
};

export default DrugList;