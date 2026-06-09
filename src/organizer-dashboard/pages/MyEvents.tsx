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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const Card = styled.div`
  background: ${theme.colors.white};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover { transform: translateY(-4px); }
`;

const Banner = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 16px;
  h3 { color: ${theme.colors.coffeeDark}; margin-bottom: 8px; }
  p { color: ${theme.colors.gray600}; font-size: 14px; margin-bottom: 4px; }
`;

const MyEvents: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/events/my-events`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(res.data.events);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <div>Loading your events...</div>;

  return (
    <Container>
      <h1 style={{ color: theme.colors.coffeeDark, marginBottom: '24px' }}>My Events</h1>
      <Grid>
        {events.map(ev => (
          <Card key={ev._id} onClick={() => navigate(`/organizer/my-events/${ev._id}`)}>
            <Banner src={ev.bannerUrl || 'https://via.placeholder.com/400x200?text=No+Banner'} alt="banner" />
            <Content>
              <h3>{ev.eventName || 'Draft Event'}</h3>
              <p>📅 {ev.eventDate ? new Date(ev.eventDate).toLocaleDateString() : 'TBD'}</p>
              <p>📍 {ev.venueName || 'Venue TBD'}</p>
              <p style={{ marginTop: '12px', fontWeight: 'bold', color: theme.colors.success }}>
                Tickets Sold: {ev.ticketsSold || 0} / {ev.maxSeats || 0}
              </p>
            </Content>
          </Card>
        ))}
      </Grid>
    </Container>
  );
};

export default MyEvents;
