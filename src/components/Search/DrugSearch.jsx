import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DrugSearch.css';

const DrugSearch = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState(['drug1', 'drug2', 'drug3', 'drug4', 'drug5']);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch some default drugs to display when the page loads
    const fetchDefaultDrugs = async () => {
      try {
        const response = await fetch('https://rxnav.nlm.nih.gov/REST/drugs.json?name=aspirin');
        const data = await response.json();
        if (data.drugGroup && data.drugGroup.conceptGroup) {
          const defaultDrugs = data.drugGroup.conceptGroup.flatMap(group => group.conceptProperties || []).slice(0, 5);
          setSuggestions(defaultDrugs.map(drug => drug.name));
        }
      } catch (error) {
        console.error('Error fetching default drugs:', error);
      }
    };

    fetchDefaultDrugs();
  }, []);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      try {
        const response = await fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${value}`);
        const data = await response.json();

        if (data.drugGroup && data.drugGroup.conceptGroup) {
          const drugs = data.drugGroup.conceptGroup.flatMap(group => group.conceptProperties || []).slice(0, 5);
          if (drugs.length > 0) {
            setNotFound(false);
            setSuggestions(drugs.map(drug => drug.name));
          } else {
            setNotFound(true);
            setSuggestions([]);
          }
        } else {
          setNotFound(true);
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setNotFound(true);
        setSuggestions([]);
      }
    } else {
      setSuggestions(['drug1', 'drug2', 'drug3', 'drug4', 'drug5']); // Reset to default drugs
      setNotFound(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(`/drug/${suggestion}`);
  };

  return (
    <div className="drug-search">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for a drug..."
        className="search-bar"
      />
      {notFound && <div className="not-found">Couldn't find anything</div>}
      <ul className="suggestions-list">
        {suggestions.map((suggestion, index) => (
          <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DrugSearch;