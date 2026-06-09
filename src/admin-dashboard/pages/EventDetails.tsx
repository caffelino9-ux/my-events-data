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

  const { event, organizer, registrations } = data;
  const revenue = (event.ticketsSold || 0) * (event.ticketPrice || 0);

  return (
    <Container>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '24px', background: 'none', border: 'none', color: theme.colors.gold, cursor: 'pointer', fontWeight: 'bold' }}>
        &larr; Back to Events
      </button>

      {event.bannerUrl && (
        <img src={event.bannerUrl} alt="Banner" style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '16px', marginBottom: '24px' }} />
      )}

      <Section>
        <Title>Event Details</Title>
        <Grid>
          <div><Label>Event Name</Label><Value>{event.eventName}</Value></div>
          <div><Label>Event Category</Label><Value>{event.eventCategory}</Value></div>
          <div><Label>Status</Label><Value>{event.status}</Value></div>
          <div><Label>Created / Updated</Label><Value>{new Date(event.createdAt).toLocaleDateString()} / {new Date(event.updatedAt).toLocaleDateString()}</Value></div>
        </Grid>
        <div style={{ marginTop: '24px' }}><Label>Event Description</Label><Value>{event.eventDescription}</Value></div>
      </Section>

      <Section>
        <Title>Location Details</Title>
        <Grid>
          <div><Label>Cafe Name</Label><Value>{event.cafeName}</Value></div>
          <div><Label>Venue Name</Label><Value>{event.venueName}</Value></div>
          <div style={{ gridColumn: 'span 2' }}><Label>Address</Label><Value>{event.address}, {event.city}, {event.state}, {event.country} - {event.pincode}</Value></div>
          <div><Label>Google Maps</Label><Value><a href={event.googleMapsLink} target="_blank" rel="noreferrer">View on Maps</a></Value></div>
          <div><Label>Coordinates</Label><Value>Lat: N/A, Lng: N/A</Value></div>
        </Grid>
      </Section>

      <Section>
        <Title>Date & Time</Title>
        <Grid>
          <div><Label>Event Date</Label><Value>{new Date(event.eventDate).toLocaleDateString()}</Value></div>
          <div><Label>Timezone</Label><Value>{event.timezone}</Value></div>
          <div><Label>Start Time</Label><Value>{event.startTime}</Value></div>
          <div><Label>End Time</Label><Value>{event.endTime}</Value></div>
        </Grid>
      </Section>

      <Section>
        <Title>Ticket Details</Title>
        <Grid>
          <div><Label>Ticket Type</Label><Value>{event.ticketType}</Value></div>
          <div><Label>Ticket Price</Label><Value>₹{event.ticketPrice}</Value></div>
          <div><Label>Maximum Seats</Label><Value>{event.maxSeats}</Value></div>
          <div><Label>Available Seats</Label><Value>{event.availableSeats}</Value></div>
          <div><Label>Tickets Sold</Label><Value>{event.ticketsSold}</Value></div>
          <div><Label>Total Revenue Generated</Label><Value style={{ color: theme.colors.success, fontWeight: 'bold' }}>₹{revenue.toLocaleString()}</Value></div>
        </Grid>
      </Section>

      <Section>
        <Title>Organizer Details</Title>
        <Grid>
          <div><Label>Organizer Name</Label><Value>{organizer?.name || event.organizerName}</Value></div>
          <div><Label>Email</Label><Value>{organizer?.email_address_manager || event.organizerEmail}</Value></div>
          <div><Label>Phone Number</Label><Value>{organizer?.Phonenumber || event.phoneNumber}</Value></div>
          <div><Label>Instagram ID</Label><Value>{event.eventInstagramId || 'N/A'}</Value></div>
        </Grid>
      </Section>

      <Section>
        <Title>Bank Details (Confidential)</Title>
        <Grid>
          <div><Label>Account Holder Name</Label><Value>{event.bankDetailsEncrypted ? 'Available (Encrypted)' : 'Not Provided'}</Value></div>
          <div><Label>Bank Name</Label><Value>***</Value></div>
          <div><Label>Account Number</Label><Value>***</Value></div>
          <div><Label>IFSC Code</Label><Value>***</Value></div>
          <div><Label>UPI ID</Label><Value>***</Value></div>
        </Grid>
        <p style={{ fontSize: '12px', color: theme.colors.warning, marginTop: '16px' }}>Note: Real bank decryption requires secondary secure gateway which is masked here for security.</p>
      </Section>

      <Section>
        <Title>Registrations ({registrations.length})</Title>
        {registrations.length === 0 ? <p>No registrations yet.</p> : (
          <div style={{ overflowX: 'auto' }}>
            <Table>
              <thead>
                <tr>
                  <th>Attendee Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Tickets</th>
                  <th>Amount Paid</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((r: any) => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 500 }}>{r.userName}</td>
                    <td>{r.email}</td>
                    <td>{r.phone}</td>
                    <td>{r.ticketCount}</td>
                    <td style={{ fontWeight: 'bold' }}>₹{r.amountPaid}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Section>
    </Container>
  );
};

export default EventDetails;
