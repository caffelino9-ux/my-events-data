import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../admin-dashboard/styles/theme';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: ${theme.componentSizes.containerMaxWidth};
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  color: ${theme.colors.coffeeDark};
  font-size: 24px;
`;

const TableCard = styled.div`
  background: ${theme.colors.white};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td { padding: 16px; text-align: left; border-bottom: 1px solid ${theme.colors.gray200}; white-space: nowrap; }
  th { background: ${theme.colors.gray100}; font-weight: 600; color: ${theme.colors.gray600}; font-size: 13px; text-transform: uppercase; }
  tr { transition: background 0.2s; cursor: pointer; }
  tr:hover { background: ${theme.colors.gray100}; }
`;

const EventRevenue: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/events/my-events`, { headers: { Authorization: `Bearer ${token}` }});
        if (res.data.success) setEvents(res.data.events);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchEvents();
  }, []);

  if (loading) return <div>Loading event revenues...</div>;

  return (
    <Container>
      <Header>
        <Title>My Event Revenue</Title>
        <p style={{ color: theme.colors.gray600, marginTop: '8px' }}>Click on an event to view full revenue and payment details.</p>
      </Header>
      <TableCard>
        <Table>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Paid Users</th>
              <th>Free Users</th>
              <th>Total Registrations</th>
              <th>Revenue</th>
              <th>Settlement Pending</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e._id} onClick={() => navigate(`/organizer/my-events/${e._id}`)}>
                <td style={{ fontWeight: 600, color: theme.colors.coffeeDark }}>{e.eventName}</td>
                <td style={{ color: theme.colors.success, fontWeight: 600 }}>{e.paidUsers || 0}</td>
                <td>{e.freeUsers || 0}</td>
                <td>{e.registrationsCount || 0}</td>
                <td style={{ fontWeight: 'bold', color: theme.colors.success }}>₹{(e.revenue || 0).toLocaleString()}</td>
                <td style={{ fontWeight: 'bold', color: theme.colors.warning }}>₹{(e.settlementPending || 0).toLocaleString()}</td>
              </tr>
            ))}
            {events.length === 0 && <tr><td colSpan={6}>No events found.</td></tr>}
          </tbody>
        </Table>
      </TableCard>
    </Container>
  );
};

export default EventRevenue;
