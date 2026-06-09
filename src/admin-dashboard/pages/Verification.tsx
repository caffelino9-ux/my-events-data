import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import toast from 'react-hot-toast';

const Container = styled.div`
  max-width: ${theme.componentSizes.containerMaxWidth};
  margin: 0 auto;
`;

const TableCard = styled.div`
  background: ${theme.colors.white};
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td { padding: 16px 24px; text-align: left; border-bottom: 1px solid ${theme.colors.gray200}; }
  th { background: ${theme.colors.gray100}; color: ${theme.colors.gray600}; font-weight: 600; font-size: 14px; text-transform: uppercase; }
  td { color: ${theme.colors.gray800}; }
  tr:last-child td { border-bottom: none; }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;

  button {
    padding: 6px 12px;
    border-radius: 6px;
    border: none;
    font-weight: bold;
    cursor: pointer;
    font-size: 12px;
  }
  
  .btn-approve { background: ${theme.colors.success}; color: white; }
  .btn-reject { background: #FF6B6B; color: white; }
`;

const Verification: React.FC = () => {
  const [cafes, setCafes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCafes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/admin/get/cafe`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
      setCafes(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCafes(); }, []);

  const handleApprove = async (id: string) => {
    if (window.confirm("Approve this organizer?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`${API_BASE_URL}/admin/approve-cafe/${id}`, {}, { headers: { Authorization: `Bearer ${token}` }});
        toast.success("Organizer approved!");
        fetchCafes();
      } catch (error) { toast.error("Failed to approve"); }
    }
  };

  const handleReject = async (id: string) => {
    if (window.confirm("Reject and delete this request?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/admin/reject-cafe/${id}`, { headers: { Authorization: `Bearer ${token}` }});
        toast.success("Request rejected");
        fetchCafes();
      } catch (error) { toast.error("Failed to reject"); }
    }
  };

  if (loading) return <div>Loading verification queue...</div>;

  return (
    <Container>
      <h1 style={{ color: theme.colors.coffeeDark, marginBottom: '24px' }}>Pending Verifications</h1>
      
      {cafes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: theme.colors.white, borderRadius: '16px' }}>
          <h2>No Pending Requests</h2>
          <p style={{ color: theme.colors.gray600 }}>All organizers have been verified.</p>
        </div>
      ) : (
        <TableCard>
          <div style={{ overflowX: 'auto' }}>
            <Table>
              <thead>
                <tr>
                  <th>Business Name</th>
                  <th>Contact Info</th>
                  <th>Instagram</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cafes.map((c) => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: '600' }}>{c.name}</td>
                    <td>
                      <div>{c.email}</div>
                      <div style={{ color: theme.colors.gray600, fontSize: '12px' }}>{c.mobileNo}</div>
                    </td>
                    <td><a href={`https://instagram.com/${c.instagramId}`} target="_blank" rel="noreferrer">{c.instagramId}</a></td>
                    <td>
                      <Actions>
                        <button className="btn-approve" onClick={() => handleApprove(c._id)}>Approve</button>
                        <button className="btn-reject" onClick={() => handleReject(c._id)}>Reject</button>
                      </Actions>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </TableCard>
      )}
    </Container>
  );
};

export default Verification;
