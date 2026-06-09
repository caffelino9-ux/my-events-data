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
  width: max-content;
  min-width: 100%;
  border-collapse: collapse;

  th, td { padding: 16px 24px; text-align: left; border-bottom: 1px solid ${theme.colors.gray200}; white-space: nowrap; }
  th { background: ${theme.colors.gray100}; color: ${theme.colors.gray600}; font-weight: 600; font-size: 14px; text-transform: uppercase; }
  td { color: ${theme.colors.gray800}; }
  tr:last-child td { border-bottom: none; }
`;

const Registrations: React.FC = () => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/admin/registrations`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        });
        setRegistrations(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRegs();
  }, []);

  if (loading) return <div>Loading global registrations...</div>;

  return (
    <Container>
      <h1 style={{ color: theme.colors.coffeeDark, marginBottom: '24px' }}>Global Ticket Feed</h1>
      
      <TableCard>
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Event Name</th>
                <th>Ticket Number</th>
                <th>Amount Paid</th>
                <th>Status</th>
                <th>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r) => (
                <tr key={r._id}>
                  <td style={{ fontWeight: '600' }}>{r.userName}</td>
                  <td>{r.email}</td>
                  <td>{r.phone}</td>
                  <td>{r.eventId?.eventName || 'Deleted Event'}</td>
                  <td style={{ fontFamily: 'monospace' }}>{r.ticketNumber}</td>
                  <td style={{ color: theme.colors.success, fontWeight: 'bold' }}>₹{r.amountPaid}</td>
                  <td style={{ textTransform: 'uppercase', fontWeight: 600, color: r.paymentStatus === 'Completed' ? theme.colors.success : theme.colors.warning }}>
                    {r.paymentStatus}
                  </td>
                  <td>{new Date(r.registrationDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </TableCard>
    </Container>
  );
};

export default Registrations;
