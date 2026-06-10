import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../admin-dashboard/styles/theme';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const Container = styled.div`
  max-width: ${theme.componentSizes.containerMaxWidth};
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  color: ${theme.colors.coffeeDark};
  font-size: 28px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: ${theme.colors.white};
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${theme.colors.gray600};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${theme.colors.coffeeDark};
`;

const Earnings: React.FC = () => {
  const [data, setData] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    totalPaidUsers: 0,
    totalFreeUsers: 0,
    totalRevenue: 0,
    pendingSettlements: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/events/earnings`, { headers: { Authorization: `Bearer ${token}` }});
        if (res.data.success) {
          setData(res.data);
        }
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchEarnings();
  }, []);

  if (loading) return <div>Loading earnings...</div>;

  return (
    <Container>
      <Header>
        <Title>Financial Overview</Title>
        <p style={{ color: theme.colors.gray600, marginTop: '8px' }}>Track your revenue, ticket sales, and payouts.</p>
      </Header>
      <Grid>
        <StatCard>
          <StatLabel>Total Events</StatLabel>
          <StatValue>{data.totalEvents}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total Registrations</StatLabel>
          <StatValue>{data.totalRegistrations}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total Paid Users</StatLabel>
          <StatValue style={{ color: theme.colors.success }}>{data.totalPaidUsers}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total Free Users</StatLabel>
          <StatValue style={{ color: theme.colors.gray600 }}>{data.totalFreeUsers}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total Revenue</StatLabel>
          <StatValue style={{ color: theme.colors.success }}>₹{data.totalRevenue.toLocaleString()}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Pending Settlement</StatLabel>
          <StatValue style={{ color: theme.colors.warning }}>₹{data.pendingSettlements.toLocaleString()}</StatValue>
        </StatCard>
      </Grid>
    </Container>
  );
};

export default Earnings;
