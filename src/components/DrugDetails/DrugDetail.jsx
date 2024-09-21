import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './DrugDetail.css';

const DrugDetail = () => {
  const { drugName } = useParams();
  const [drugDetails, setDrugDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDrugDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${drugName}`);
        const data = await response.json();
        if (data.drugGroup && data.drugGroup.conceptGroup) {
          const drugs = data.drugGroup.conceptGroup.flatMap(group => group.conceptProperties || []);
          if (drugs.length > 0) {
            setDrugDetails(drugs[0]); // Assuming we take the first match
          } else {
            setError('No details found for this drug.');
          }
        } else {
          setError('No details found for this drug.');
        }
      } catch (error) {
        setError('Error fetching drug details.');
        console.error('Error fetching drug details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrugDetails();
  }, [drugName]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!drugDetails) {
    return <div>No details available.</div>;
  }

  return (
    <div className="drug-detail">
      <h2>Drug Details for {drugName}</h2>
      <table className="drug-detail-table">
        <tbody>
          {Object.entries(drugDetails).map(([key, value]) => (
            <tr key={key}>
              <td className="drug-detail-key">{key}</td>
              <td className="drug-detail-value">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DrugDetail;