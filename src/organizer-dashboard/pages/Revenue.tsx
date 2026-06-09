import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../admin-dashboard/styles/theme';
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
        const res = await axios.get(`${API_BASE_URL}/events/dashboard-stats`, {
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

  if (loading) return <div>Loading revenue stats...</div>;

  const totalRevenue = stats?.totalRevenue || 0;
  const platformFee = totalRevenue * 0.1;
  const netEarnings = totalRevenue - platformFee;

  return (
    <Container>
      <h1 style={{ color: theme.colors.coffeeDark, marginBottom: '24px' }}>My Revenue</h1>

      <Grid>
        <StatCard bg={theme.colors.coffeeDark} color={theme.colors.cream}>
          <h3>Total Gross Sales</h3>
          <div className="value">₹{totalRevenue.toLocaleString()}</div>
        </StatCard>
        <StatCard>
          <h3>Platform Fee (10%)</h3>
          <div className="value" style={{ color: theme.colors.warning }}>- ₹{platformFee.toLocaleString()}</div>
        </StatCard>
        <StatCard bg={theme.colors.gold} color={theme.colors.white}>
          <h3>Net Earnings</h3>
          <div className="value">₹{netEarnings.toLocaleString()}</div>
        </StatCard>
      </Grid>
    </Container>
  );
};

export default Revenue;
