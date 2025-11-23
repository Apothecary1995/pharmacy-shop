// removed search bar changed it for catagories

import React, { useState } from 'react';

const CATEGORIES = [
  'All',
  'Pain Relief',
  'Antidepressants',
  'Contraceptives', 
  'Vitamins',
  'Dermatology',
  'Allergy',
];


const DrugFilters = ({ onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    
    
    onFilterChange('', category); 
  };

  return (
    <div className="drug-filters-container" style={{ marginBottom: '20px' }}>
      {/* only cataogory will remain */}
      <div className="category-buttons" style={{ display: 'flex', gap: '10px', overflowX: 'auto', justifyContent: 'center' }}>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            style={{
              padding: '8px 15px',
              border: `1px solid ${selectedCategory === category ? '#007bff' : '#ccc'}`,
              backgroundColor: selectedCategory === category ? '#007bff' : 'white',
              color: selectedCategory === category ? 'white' : 'black',
              borderRadius: '20px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              minWidth: '100px',
            }}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DrugFilters;