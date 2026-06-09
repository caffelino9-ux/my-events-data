import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../admin-dashboard/styles/theme';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { useParams, useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: ${theme.componentSizes.containerMaxWidth};
  margin: 0 auto;
  background: ${theme.colors.white};
  padding: 32px;
  border-radius: 16px;
`;

const EventDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/events/my-events`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        });
        const found = res.data.events.find((e: any) => e._id === id);
        setEvent(found);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div>Loading details...</div>;
  if (!event) return <div>Event not found.</div>;

  return (
    <Container>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '24px', cursor: 'pointer', border: 'none', background: 'none', color: theme.colors.gold }}>
        &larr; Back to My Events
      </button>
      
      {event.bannerUrl && <img src={event.bannerUrl} alt="banner" style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px', marginBottom: '24px' }} />}
      
      <h1 style={{ color: theme.colors.coffeeDark }}>{event.eventName}</h1>
      <p style={{ color: theme.colors.gray600, fontSize: '18px', marginBottom: '24px' }}>{event.eventDescription}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div>
          <h3>Event Status & Category</h3>
          <p><strong>Status:</strong> <span style={{ textTransform: 'uppercase', color: event.status === 'published' ? theme.colors.success : theme.colors.gray600 }}>{event.status}</span></p>
          <p><strong>Category:</strong> {event.eventCategory}</p>
        </div>
        <div>
          <h3>Hosted By</h3>
          <p><strong>Name:</strong> {event.organizerName}</p>
          <p><strong>Club/Company:</strong> {event.clubCompanyName || 'N/A'}</p>
          <p><strong>Instagram:</strong> {event.eventInstagramId || 'N/A'}</p>
          <p><strong>Contact:</strong> {event.organizerEmail} | {event.phoneNumber}</p>
        </div>
        <div>
          <h3>Date & Time</h3>
          <p>{new Date(event.eventDate).toLocaleDateString()} | {event.startTime} - {event.endTime}</p>
        </div>
        <div>
          <h3>Location</h3>
          <p>{event.cafeName ? `${event.cafeName} - ` : ''}{event.venueName}</p>
          <p>{event.address}, {event.city}, {event.state}, {event.country} - {event.pincode}</p>
          {event.googleMapsLink && <p><a href={event.googleMapsLink} target="_blank" rel="noreferrer" style={{ color: theme.colors.gold }}>Google Maps Link</a></p>}
        </div>
        <div>
          <h3>Tickets</h3>
          <p>{event.ticketType} - ₹{event.ticketPrice}</p>
          <p>Total Capacity: {event.maxSeats}</p>
        </div>
        <div>
          <h3>Performance</h3>
          <p style={{ color: theme.colors.success, fontWeight: 'bold' }}>Registered Count (Sold): {event.ticketsSold}</p>
          <p style={{ color: '#FF6B6B', fontWeight: 'bold' }}>Remaining Seats: {event.maxSeats - event.ticketsSold}</p>
          <p style={{ color: theme.colors.success, fontWeight: 'bold' }}>Revenue: ₹{event.ticketsSold * event.ticketPrice}</p>
        </div>
        <div style={{ gridColumn: '1 / -1', marginTop: '16px', padding: '16px', background: theme.colors.gray100, borderRadius: '8px' }}>
          <h3>Bank Details (For Settlements)</h3>
          {(event.upiId || event.bankDetails?.upiId || event.accountHolderName || event.bankDetails?.accountHolderName || event.bankName || event.bankDetails?.bankName) ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
              {(event.accountHolderName || event.bankDetails?.accountHolderName) && (
                <p><span style={{ fontWeight: 'bold' }}>Account Holder:</span> {event.accountHolderName || event.bankDetails?.accountHolderName || event.bankDetails?.accountHolder || 'N/A'}</p>
              )}
              {(event.bankName || event.bankDetails?.bankName) && (
                <p><span style={{ fontWeight: 'bold' }}>Bank Name:</span> {event.bankName || event.bankDetails?.bankName || 'N/A'}</p>
              )}
              {(event.accountNumber || event.bankDetails?.accountNumber) && (
                <p><span style={{ fontWeight: 'bold' }}>Account Number:</span> {event.accountNumber || event.bankDetails?.accountNumber || 'N/A'}</p>
              )}
              {(event.ifscCode || event.bankDetails?.ifscCode) && (
                <p><span style={{ fontWeight: 'bold' }}>IFSC Code:</span> {event.ifscCode || event.bankDetails?.ifscCode || event.bankDetails?.ifsc || 'N/A'}</p>
              )}
              {(event.upiId || event.bankDetails?.upiId) && (
                <p><span style={{ fontWeight: 'bold' }}>UPI ID:</span> {event.upiId || event.bankDetails?.upiId || event.bankDetails?.upi || 'N/A'}</p>
              )}
              {(event.paymentMobileNumber || event.bankDetails?.paymentMobileNumber) && (
                <p><span style={{ fontWeight: 'bold' }}>Payment Mobile:</span> {event.paymentMobileNumber || event.bankDetails?.paymentMobileNumber || event.bankDetails?.phoneNumber || 'N/A'}</p>
              )}
            </div>
          ) : (
            <p style={{ color: theme.colors.gray600, marginTop: '12px' }}>No bank details provided for this event.</p>
          )}
        </div>
      </div>
    </Container>
  );
};

export default EventDetails;
