import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ApplicantDashboard = () => {
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyBids = async () => {
      try {
        const response = await api.bids.getByFreelancerId();
        setBids(response.data);
      } catch (err) {
        console.error('Error fetching bids:', err);
        setError('Failed to load your bids');
      } finally {
        setLoading(false);
      }
    };

    fetchMyBids();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '2rem' }}>My Applications</h1>
        <button 
          onClick={() => navigate('/')}
          style={{ 
            backgroundColor: 'black',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Browse Jobs
        </button>
      </div>

      {error && (
        <div style={{ 
          backgroundColor: '#fff3f3', 
          color: '#dc3545', 
          padding: '16px', 
          marginBottom: '20px',
          borderRadius: '4px'
        }}>
          Failed to load your bids
        </div>
      )}

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '24px',
        marginBottom: '20px',
        border: '1px solid rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>My Bids</h2>
        <p style={{ color: '#6c757d', marginBottom: '40px' }}>Track the status of your job applications</p>
        <div style={{ textAlign: 'center', color: '#6c757d' }}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div>You haven't submitted any bids yet</div>
          )}
        </div>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '24px',
        border: '1px solid rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Application Statistics</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '24px', 
            borderRadius: '8px', 
            flex: 1, 
            margin: '0 10px'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>0</div>
            <div style={{ color: '#6c757d' }}>Total Applications</div>
          </div>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '24px', 
            borderRadius: '8px', 
            flex: 1, 
            margin: '0 10px'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>0</div>
            <div style={{ color: '#6c757d' }}>Accepted</div>
          </div>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '24px', 
            borderRadius: '8px', 
            flex: 1, 
            margin: '0 10px'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>0</div>
            <div style={{ color: '#6c757d' }}>Pending</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashboard; 