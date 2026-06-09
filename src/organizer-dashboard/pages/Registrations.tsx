import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../admin-dashboard/styles/theme';
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
`;

const Registrations: React.FC = () => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/events/registrations`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        });
        setRegistrations(res.data.registrations);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRegs();
  }, []);

  if (loading) return <div>Loading your registrations...</div>;

  return (
    <Container>
      <h1 style={{ color: theme.colors.coffeeDark, marginBottom: '24px' }}>My Registrations</h1>
      <TableCard>
        <Table>
          <thead>
            <tr>
              <th>Attendee</th>
              <th>Event</th>
              <th>Ticket #</th>
              <th>Tickets</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Check-In</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map(r => (
              <tr key={r._id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{r.userName}</div>
                  <div style={{ fontSize: '12px', color: theme.colors.gray600 }}>{r.email}</div>
                </td>
                <td>{r.eventId?.eventName || 'Deleted Event'}</td>
                <td style={{ fontFamily: 'monospace' }}>{r.ticketNumber}</td>
                <td>{r.ticketCount}</td>
                <td style={{ fontWeight: 'bold' }}>₹{r.amountPaid}</td>
                <td>
                  <span style={{ color: r.paymentStatus === 'Completed' ? theme.colors.success : theme.colors.warning }}>
                    {r.paymentStatus}
                  </span>
                </td>
                <td>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', background: r.checkInStatus ? theme.colors.success : theme.colors.gray200, color: r.checkInStatus ? 'white' : theme.colors.gray800 }}>
                    {r.checkInStatus ? 'Checked In' : 'Pending'}
                  </span>
                </td>
                <td>{new Date(r.registrationDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableCard>
    </Container>
  );
};

export default Registrations;
