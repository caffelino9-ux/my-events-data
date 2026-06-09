import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

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

const Organizers: React.FC = () => {
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/admin/organizers`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrganizers(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizers();
  }, []);

  if (loading) return <div>Loading organizers data...</div>;

  return (
    <Container>
      <h1 style={{ color: theme.colors.coffeeDark, marginBottom: '24px' }}>Platform Organizers</h1>
      
      <TableCard>
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Events Created</th>
                <th>Tickets Sold</th>
                <th>Revenue Generated</th>
              </tr>
            </thead>
            <tbody>
              {organizers.map((o) => (
                <tr key={o._id}>
                  <td style={{ fontWeight: '600' }}>{o.Name || o.name}</td>
                  <td>{o.email_address_manager || o.email}</td>
                  <td>{o.Phonenumber}</td>
                  <td>{o.totalEvents || 0}</td>
                  <td>{o.totalTicketsSold || 0}</td>
                  <td style={{ color: theme.colors.success, fontWeight: 'bold' }}>₹{(o.totalRevenue || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </TableCard>
    </Container>
  );
};

export default Organizers;
