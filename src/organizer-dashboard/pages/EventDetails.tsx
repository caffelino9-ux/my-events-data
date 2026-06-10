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
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/events/event/${id}`, {
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

  if (loading) return <div>Loading details...</div>;
  if (!data || !data.event) return <div>Event not found.</div>;

  const { event, registrations = [], payments = [] } = data;
  
  const revenue = registrations.reduce((sum: number, r: any) => sum + (r.amountPaid || 0), 0);
  const platformFee = revenue * 0.05;
  const settlementAmount = revenue - platformFee;
  const paidUsers = registrations.filter((r: any) => r.amountPaid > 0).length;
  const freeUsers = registrations.filter((r: any) => r.amountPaid === 0).length;
  const ticketsSold = registrations.reduce((sum: number, r: any) => sum + (r.ticketCount || 1), 0);

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

        <div style={{ gridColumn: '1 / -1', marginTop: '16px', padding: '24px', background: theme.colors.white, borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: `2px solid ${theme.colors.gray200}`, paddingBottom: '12px', marginBottom: '24px' }}>Financial Breakdown</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div><p><b>Total Revenue:</b> <span style={{ color: theme.colors.success, fontSize: '18px' }}>₹{revenue.toLocaleString()}</span></p></div>
            <div><p><b>Paid Users:</b> {paidUsers}</p></div>
            <div><p><b>Free Users:</b> {freeUsers}</p></div>
            <div><p><b>Total Registrations:</b> {ticketsSold}</p></div>
            <div><p><b>Platform Fee (5%):</b> <span style={{ color: theme.colors.warning }}>-₹{platformFee.toLocaleString()}</span></p></div>
            <div><p><b>Settlement Amount:</b> <span style={{ color: theme.colors.success, fontSize: '18px', fontWeight: 'bold' }}>₹{settlementAmount.toLocaleString()}</span></p></div>
          </div>
        </div>

        <div style={{ gridColumn: '1 / -1', marginTop: '16px', padding: '24px', background: theme.colors.white, borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: `2px solid ${theme.colors.gray200}`, paddingBottom: '12px', marginBottom: '24px' }}>Payment History</h3>
          {payments.length === 0 ? <p>No paid transactions found.</p> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px', borderBottom: `1px solid ${theme.colors.gray200}`, background: theme.colors.gray100 }}>User Name</th>
                    <th style={{ padding: '12px', borderBottom: `1px solid ${theme.colors.gray200}`, background: theme.colors.gray100 }}>Email</th>
                    <th style={{ padding: '12px', borderBottom: `1px solid ${theme.colors.gray200}`, background: theme.colors.gray100 }}>Phone</th>
                    <th style={{ padding: '12px', borderBottom: `1px solid ${theme.colors.gray200}`, background: theme.colors.gray100 }}>Amount Paid</th>
                    <th style={{ padding: '12px', borderBottom: `1px solid ${theme.colors.gray200}`, background: theme.colors.gray100 }}>Payment ID</th>
                    <th style={{ padding: '12px', borderBottom: `1px solid ${theme.colors.gray200}`, background: theme.colors.gray100 }}>Date</th>
                    <th style={{ padding: '12px', borderBottom: `1px solid ${theme.colors.gray200}`, background: theme.colors.gray100 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p: any) => (
                    <tr key={p._id}>
                      <td style={{ padding: '12px', borderBottom: `1px solid ${theme.colors.gray200}` }}>{p.userId?.name || 'Guest'}</td>
                      <td style={{ padding: '12px', borderBottom: `1px solid ${theme.colors.gray200}` }}>{p.userId?.email || 'N/A'}</td>
                      <td style={{ padding: '12px', borderBottom: `1px solid ${theme.colors.gray200}` }}>{p.userId?.phone || 'N/A'}</td>
                      <td style={{ padding: '12px', borderBottom: `1px solid ${theme.colors.gray200}`, color: theme.colors.success, fontWeight: 'bold' }}>₹{p.amount}</td>
                      <td style={{ padding: '12px', borderBottom: `1px solid ${theme.colors.gray200}`, fontFamily: 'monospace' }}>{p.transactionId}</td>
                      <td style={{ padding: '12px', borderBottom: `1px solid ${theme.colors.gray200}` }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '12px', borderBottom: `1px solid ${theme.colors.gray200}`, color: theme.colors.success }}>{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </Container>
  );
};

export default EventDetails;
