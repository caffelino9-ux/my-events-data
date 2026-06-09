import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
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
  th, td { padding: 16px; text-align: left; border-bottom: 1px solid ${theme.colors.gray200}; }
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
        const res = await axios.get(`${API_BASE_URL}/admin/settlements`, { headers: { Authorization: `Bearer ${token}` }});
        setEvents(res.data);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchEvents();
  }, []);

  if (loading) return <div>Loading event revenues...</div>;

  return (
    <Container>
      <Header>
        <Title>Event Revenue Dashboard</Title>
        <p style={{ color: theme.colors.gray600, marginTop: '8px' }}>Click on an event to view full revenue and payment details.</p>
      </Header>
      <TableCard>
        <Table>
          <thead>
            <tr>
              <th>Event</th>
              <th>Tickets Sold</th>
              <th>Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e.eventId?._id} onClick={() => navigate(`/admin/event/${e.eventId?._id}`)}>
                <td style={{ fontWeight: 600, color: theme.colors.coffeeDark }}>{e.eventId?.eventName}</td>
                <td>{e.ticketsSold || 0}</td>
                <td style={{ fontWeight: 'bold', color: theme.colors.success }}>₹{e.totalRevenue}</td>
              </tr>
            ))}
            {events.length === 0 && <tr><td colSpan={3}>No revenue generating events found.</td></tr>}
          </tbody>
        </Table>
      </TableCard>
    </Container>
  );
};

export default EventRevenue;
