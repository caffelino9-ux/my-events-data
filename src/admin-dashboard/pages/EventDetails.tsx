import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { useParams, useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Section = styled.div`
  background: ${theme.colors.white};
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 18px;
  color: ${theme.colors.coffeeDark};
  margin-bottom: 24px;
  border-bottom: 2px solid ${theme.colors.gray200};
  padding-bottom: 12px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;

const Label = styled.div`
  font-size: 13px;
  color: ${theme.colors.gray600};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

const Value = styled.div`
  font-size: 16px;
  color: ${theme.colors.gray800};
  font-weight: 500;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td { padding: 12px; text-align: left; border-bottom: 1px solid ${theme.colors.gray200}; }
  th { background: ${theme.colors.gray100}; font-size: 13px; text-transform: uppercase; color: ${theme.colors.gray600}; }
`;

const EventDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/admin/event/${id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div>Loading full event details...</div>;
  if (!data || !data.event) return <div>Event not found</div>;

  const { event, organizer, registrations, analytics } = data;
  const revenue = registrations.reduce((sum: number, r: any) => sum + (r.amountPaid || 0), 0);
  const ticketsSold = registrations.reduce((sum: number, r: any) => sum + (r.ticketCount || 1), 0);
  
  const today = new Date();
  today.setHours(0,0,0,0);
  const revenueToday = registrations.reduce((sum: number, r: any) => {
    if (new Date(r.registrationDate) >= today) return sum + (r.amountPaid || 0);
    return sum;
  }, 0);

  const conversionRate = event.maxSeats > 0 ? ((ticketsSold / event.maxSeats) * 100).toFixed(1) : 0;

  return (
    <Container>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '24px', background: 'none', border: 'none', color: theme.colors.gold, cursor: 'pointer', fontWeight: 'bold' }}>
        &larr; Back to Events
      </button>

      {event.bannerUrl && (
        <img src={event.bannerUrl} alt="Banner" style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '16px', marginBottom: '24px' }} />
      )}

      <Section>
        <Title>Event Information</Title>
        <Grid>
          <div><Label>Event Name</Label><Value>{event.eventName}</Value></div>
          <div><Label>Organizer</Label><Value>{organizer?.name || event.organizerName}</Value></div>
          <div><Label>Location</Label><Value>{event.cafeName} - {event.venueName}, {event.city}</Value></div>
          <div><Label>Date & Time</Label><Value>{new Date(event.eventDate).toLocaleDateString()} at {event.startTime}</Value></div>
          <div><Label>Ticket Price</Label><Value>₹{event.ticketPrice}</Value></div>
          <div><Label>Capacity</Label><Value>{event.maxSeats} Seats</Value></div>
          <div><Label>Status</Label><Value style={{ textTransform: 'uppercase', color: theme.colors.success, fontWeight: 'bold' }}>{event.status}</Value></div>
        </Grid>
      </Section>

      <Section>
        <Title>Revenue Analytics</Title>
        <Grid>
          <div><Label>Total Revenue</Label><Value style={{ color: theme.colors.success, fontSize: '24px', fontWeight: 'bold' }}>₹{revenue.toLocaleString()}</Value></div>
          <div><Label>Revenue Today</Label><Value style={{ color: theme.colors.gold, fontSize: '24px', fontWeight: 'bold' }}>₹{revenueToday.toLocaleString()}</Value></div>
          <div><Label>Tickets Sold</Label><Value>{ticketsSold}</Value></div>
          <div><Label>Remaining Tickets</Label><Value>{(event.maxSeats || 0) - ticketsSold}</Value></div>
          <div><Label>Seat Fill Rate</Label><Value>{conversionRate}%</Value></div>
        </Grid>
      </Section>

      <Section>
        <Title>Registration Analytics</Title>
        <Grid>
          <div><Label>Total Registrations</Label><Value>{registrations.length}</Value></div>
          <div><Label>New Registrations Today</Label><Value>{analytics?.newRegistrationsToday || 0}</Value></div>
          <div><Label>Male</Label><Value>{analytics?.maleCount || 0}</Value></div>
          <div><Label>Female</Label><Value>{analytics?.femaleCount || 0}</Value></div>
          <div><Label>Other / Unspecified</Label><Value>{analytics?.otherCount || 0}</Value></div>
        </Grid>
      </Section>

      <Section>
        <Title>Live Activity Feed</Title>
        <div style={{ display: 'flex', gap: '32px', marginBottom: '24px' }}>
          <div style={{ background: theme.colors.coffeeDark, color: 'white', padding: '16px', borderRadius: '12px', flex: 1 }}>
            <div style={{ fontSize: '13px', opacity: 0.8, textTransform: 'uppercase', marginBottom: '8px' }}>Live Tickets Sold</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: theme.colors.gold }}>{ticketsSold}</div>
          </div>
          <div style={{ background: theme.colors.coffeeDark, color: 'white', padding: '16px', borderRadius: '12px', flex: 1 }}>
            <div style={{ fontSize: '13px', opacity: 0.8, textTransform: 'uppercase', marginBottom: '8px' }}>Live Revenue</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: theme.colors.success }}>₹{revenue.toLocaleString()}</div>
          </div>
        </div>

        <h3 style={{ fontSize: '16px', color: theme.colors.coffeeDark, marginBottom: '16px' }}>Recent Registrations</h3>
        {registrations.length === 0 ? <p>No activity yet.</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {registrations.slice(0, 10).map((r: any) => {
              const minutesAgo = Math.floor((new Date().getTime() - new Date(r.registrationDate).getTime()) / 60000);
              let timeStr = minutesAgo < 1 ? 'Just now' : minutesAgo < 60 ? `${minutesAgo} minutes ago` : minutesAgo < 1440 ? `${Math.floor(minutesAgo/60)} hours ago` : `${Math.floor(minutesAgo/1440)} days ago`;
              return (
                <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: theme.colors.gray100, borderRadius: '8px' }}>
                  <div>
                    <strong style={{ color: theme.colors.coffeeDark }}>{r.userName}</strong> registered 
                    {r.amountPaid > 0 ? <span style={{ color: theme.colors.success, fontWeight: 'bold' }}> and paid ₹{r.amountPaid}</span> : ' for a free ticket'}
                  </div>
                  <div style={{ color: theme.colors.gray600, fontSize: '13px' }}>{timeStr}</div>
                </div>
              );
            })}
          </div>
        )}
      </Section>
    </Container>
  );
};

export default EventDetails;
