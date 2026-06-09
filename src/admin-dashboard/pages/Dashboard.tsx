import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const Container = styled.div`
  max-width: ${theme.componentSizes.containerMaxWidth};
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div<{ warning?: boolean, success?: boolean }>`
  background: ${theme.colors.white};
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  border: ${props => props.warning ? `2px solid ${theme.colors.warning}` : props.success ? `2px solid ${theme.colors.success}` : 'none'};

  h3 { 
    color: ${props => props.warning ? theme.colors.warning : props.success ? theme.colors.success : theme.colors.gray600}; 
    font-size: 13px; 
    font-weight: 600; 
    margin-bottom: 8px; 
    text-transform: uppercase; 
    letter-spacing: 0.5px; 
  }
  .value { 
    font-size: 32px; 
    font-weight: 700; 
    color: ${props => props.warning ? theme.colors.warning : props.success ? theme.colors.success : theme.colors.coffeeDark}; 
  }
`;

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [settlements, setSettlements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [statsRes, settlementsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/admin/dashboard-stats`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/admin/settlements`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setStats(statsRes.data);
        setSettlements(settlementsRes.data);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading platform overview...</div>;

  return (
    <Container>
      <h1 style={{ color: theme.colors.coffeeDark, marginBottom: '24px' }}>Platform Overview</h1>
      
      <Grid>
        <StatCard><h3>Total Events</h3><div className="value">{stats?.totalEvents || 0}</div></StatCard>
        <StatCard><h3>Published Events</h3><div className="value">{stats?.publishedEvents || 0}</div></StatCard>
        <StatCard warning><h3>Pending Review Events</h3><div className="value">{stats?.pendingReviewEvents || 0}</div></StatCard>
        <StatCard><h3>Cancelled Events</h3><div className="value" style={{ color: '#FF6B6B' }}>{stats?.cancelledEvents || 0}</div></StatCard>
        
        <StatCard><h3>Total Organizers</h3><div className="value">{stats?.totalOrganizers || 0}</div></StatCard>
        <StatCard><h3>Total Users</h3><div className="value">{stats?.totalUsers || 0}</div></StatCard>
        <StatCard><h3>Total Registrations</h3><div className="value">{stats?.totalRegistrations || 0}</div></StatCard>
        
        <StatCard><h3>Total Tickets Sold</h3><div className="value">{stats?.totalTicketsSold || 0}</div></StatCard>
        <StatCard success><h3>Total Revenue</h3><div className="value">₹{stats?.totalRevenue?.toLocaleString() || 0}</div></StatCard>
        <StatCard success><h3>Today's Revenue</h3><div className="value">₹{stats?.todaysRevenue?.toLocaleString() || 0}</div></StatCard>
        <StatCard success><h3>This Month Revenue</h3><div className="value">₹{stats?.thisMonthRevenue?.toLocaleString() || 0}</div></StatCard>
      </Grid>

      <h2 style={{ color: theme.colors.coffeeDark, marginBottom: '16px', marginTop: '32px' }}>Recent Payment Settlements</h2>
      <div style={{ background: theme.colors.white, borderRadius: '16px', padding: '0', overflowX: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: 'min-content', minWidth: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '16px', background: theme.colors.gray100, color: theme.colors.gray600, textAlign: 'left', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase' }}>Organizer</th>
              <th style={{ padding: '16px', background: theme.colors.gray100, color: theme.colors.gray600, textAlign: 'left', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase' }}>Account Holder</th>
              <th style={{ padding: '16px', background: theme.colors.gray100, color: theme.colors.gray600, textAlign: 'left', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase' }}>Mobile</th>
              <th style={{ padding: '16px', background: theme.colors.gray100, color: theme.colors.gray600, textAlign: 'left', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase' }}>UPI ID</th>
              <th style={{ padding: '16px', background: theme.colors.gray100, color: theme.colors.gray600, textAlign: 'left', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase' }}>Amount Payable</th>
              <th style={{ padding: '16px', background: theme.colors.gray100, color: theme.colors.gray600, textAlign: 'left', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {settlements.slice(0, 5).map((s: any) => (
              <tr key={s._id} style={{ borderBottom: `1px solid ${theme.colors.gray200}` }}>
                <td style={{ padding: '16px', color: theme.colors.gray800, fontWeight: '600', whiteSpace: 'nowrap' }}>{s.organizerName}</td>
                <td style={{ padding: '16px', color: theme.colors.gray800, whiteSpace: 'nowrap' }}>{s.bankDetails?.accountHolderName || s.bankDetails?.accountHolder || 'N/A'}</td>
                <td style={{ padding: '16px', color: theme.colors.gray800, whiteSpace: 'nowrap' }}>{s.bankDetails?.paymentMobileNumber || s.bankDetails?.phoneNumber || 'N/A'}</td>
                <td style={{ padding: '16px', color: theme.colors.gray800, whiteSpace: 'nowrap' }}>{s.bankDetails?.upiId || s.bankDetails?.upi || 'N/A'}</td>
                <td style={{ padding: '16px', color: theme.colors.success, fontWeight: 'bold', whiteSpace: 'nowrap' }}>₹{s.amountPayable.toLocaleString()}</td>
                <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                  <span style={{ color: s.status === 'Paid' ? theme.colors.success : theme.colors.warning, fontWeight: 'bold' }}>{s.status}</span>
                </td>
              </tr>
            ))}
            {settlements.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '16px', textAlign: 'center', color: theme.colors.gray600 }}>No settlements found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Container>
  );
};

export default Dashboard;
