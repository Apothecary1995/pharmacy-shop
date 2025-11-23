import React, { useState } from 'react';
import LeftSidebar from '../components/Layout/LeftSidebar';
import RightSidebar from '../components/Layout/RightSidebar';
import DrugList from '../components/Common/DrugList';
import DrugFilters from '../components/Common/DrugFilters';

const HomePage = () => {
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [filters, setFilters] = useState({ 
    searchQuery: '', 
    category: 'All' 
  });

  const handleFilterChange = (newSearchQuery, newCategory) => {
    setFilters({ 
      searchQuery: newSearchQuery, 
      category: newCategory 
    });
  };

  return (
    <div className="main-layout">
      <LeftSidebar drug={selectedDrug} />
      
      <div className="center-content">
        
        {/* Products */}
        <h2 style={{ marginBottom: '15px' }}>Products</h2> 
        
        {/*  DrugFilters  */}
        <DrugFilters onFilterChange={handleFilterChange} /> 
        
        {/* list og profucts */}
        <DrugList onDrugSelect={setSelectedDrug} filters={filters} /> 
      </div>

      <RightSidebar />
    </div>
  );
};

export default HomePage;