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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div<{ bg?: string, color?: string }>`
  background: ${props => props.bg || theme.colors.white};
  padding: 32px 24px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);

  h3 { color: ${props => props.color || theme.colors.gray600}; font-size: 16px; font-weight: 500; margin-bottom: 8px; text-transform: uppercase; }
  .value { font-size: 40px; font-weight: 700; color: ${props => props.color || theme.colors.coffeeDark}; }
`;

const Revenue: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/admin/dashboard-stats`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading platform revenue...</div>;

  const total = stats?.totalRevenue || 0;
  const commission = total * 0.1; // 10% platform commission
  const organizerEarnings = total * 0.9;

  return (
    <Container>
      <h1 style={{ color: theme.colors.coffeeDark, marginBottom: '24px' }}>Platform Revenue</h1>

      <Grid>
        <StatCard bg={theme.colors.gold} color={theme.colors.white}>
          <h3>Total Gross Revenue</h3>
          <div className="value">₹{total.toLocaleString()}</div>
        </StatCard>
        <StatCard bg={theme.colors.coffeeDark} color={theme.colors.cream}>
          <h3>Platform Commission (10%)</h3>
          <div className="value">₹{commission.toLocaleString()}</div>
        </StatCard>
        <StatCard>
          <h3>Organizer Earnings (90%)</h3>
          <div className="value" style={{ color: theme.colors.success }}>₹{organizerEarnings.toLocaleString()}</div>
        </StatCard>
      </Grid>
    </Container>
  );
};

export default Revenue;
