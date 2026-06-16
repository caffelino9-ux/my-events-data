import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const Container = styled.div`
  max-width: ${theme.componentSizes.containerMaxWidth};
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
  h1 {
    color: ${theme.colors.coffeeDark};
    font-size: 28px;
    font-weight: 700;
  }
  p {
    color: ${theme.colors.gray600};
    font-size: 15px;
    margin-top: 4px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div<{ warning?: boolean, success?: boolean, highlight?: boolean }>`
  background: ${props => props.highlight ? theme.colors.coffeeDark : theme.colors.white};
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border: ${props => props.warning ? `2px solid ${theme.colors.warning}` : props.success ? `2px solid ${theme.colors.success}` : 'none'};
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  h3 { 
    color: ${props => props.highlight ? theme.colors.gold : (props.warning ? theme.colors.warning : props.success ? theme.colors.success : theme.colors.gray600)}; 
    font-size: 13px; 
    font-weight: 600; 
    margin-bottom: 12px; 
    text-transform: uppercase; 
    letter-spacing: 0.5px; 
  }
  .value { 
    font-size: 36px; 
    font-weight: 700; 
    color: ${props => props.highlight ? theme.colors.white : (props.warning ? theme.colors.warning : props.success ? theme.colors.success : theme.colors.gray800)}; 
    margin-bottom: 4px;
  }
  .subtext {
    font-size: 13px;
    color: ${props => props.highlight ? 'rgba(255,255,255,0.7)' : theme.colors.gray500};
  }
`;

const SectionTitle = styled.h2`
  color: ${theme.colors.coffeeDark};
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 700;
`;

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const statsRes = await axios.get(`${API_BASE_URL}/admin/dashboard-stats`, { headers: { Authorization: `Bearer ${token}` } });
        setStats(statsRes.data);
      } catch (error: any) {
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
      <Header>
        <h1>Platform Overview</h1>
        <p>Live metrics and performance indicators</p>
      </Header>
      
      <SectionTitle>Key Performance Indicators</SectionTitle>
      <Grid>
        <StatCard highlight>
          <h3>Total Revenue</h3>
          <div className="value">₹{stats?.totalRevenue?.toLocaleString() || 0}</div>
          <div className="subtext">All time platform earnings</div>
        </StatCard>
        <StatCard success>
          <h3>Today's Revenue</h3>
          <div className="value">₹{stats?.todaysRevenue?.toLocaleString() || 0}</div>
          <div className="subtext">Generated today</div>
        </StatCard>
        <StatCard>
          <h3>Total Tickets Sold</h3>
          <div className="value">{stats?.totalTicketsSold?.toLocaleString() || 0}</div>
          <div className="subtext">Across all events</div>
        </StatCard>
        <StatCard>
          <h3>Today's Registrations</h3>
          <div className="value">{stats?.todaysRegistrations?.toLocaleString() || 0}</div>
          <div className="subtext">New users today</div>
        </StatCard>
      </Grid>

      <SectionTitle>Event & Organizer Activity</SectionTitle>
      <Grid>
        <StatCard>
          <h3>Total Events</h3>
          <div className="value">{stats?.totalEvents || 0}</div>
          <div className="subtext">Lifetime events created</div>
        </StatCard>
        <StatCard>
          <h3>Active Events</h3>
          <div className="value">{stats?.activeEvents || 0}</div>
          <div className="subtext">Currently live & published</div>
        </StatCard>
        <StatCard>
          <h3>Upcoming Events</h3>
          <div className="value">{stats?.upcomingEvents || 0}</div>
          <div className="subtext">Scheduled for future dates</div>
        </StatCard>
        <StatCard>
          <h3>Total Organizers</h3>
          <div className="value">{stats?.totalOrganizers || 0}</div>
          <div className="subtext">Registered partners</div>
        </StatCard>
        <StatCard>
          <h3>Avg Tickets / Event</h3>
          <div className="value">{stats?.averageTicketsPerEvent || 0}</div>
          <div className="subtext">Based on active events</div>
        </StatCard>
      </Grid>
    </Container>
  );
};

export default Dashboard;
