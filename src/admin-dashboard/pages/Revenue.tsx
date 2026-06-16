import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Container = styled.div`
  max-width: ${theme.componentSizes.containerMaxWidth};
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
  h1 { color: ${theme.colors.coffeeDark}; font-size: 28px; font-weight: 700; }
  p { color: ${theme.colors.gray600}; font-size: 15px; margin-top: 4px; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled.div<{ highlight?: boolean }>`
  background: ${props => props.highlight ? theme.colors.coffeeDark : theme.colors.white};
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);

  h3 { color: ${props => props.highlight ? theme.colors.gold : theme.colors.gray600}; font-size: 13px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px; }
  .value { font-size: 28px; font-weight: 700; color: ${props => props.highlight ? theme.colors.white : theme.colors.gray800}; }
`;

const SectionTitle = styled.h2`
  color: ${theme.colors.coffeeDark};
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 700;
  margin-top: 32px;
`;

const ChartContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  margin-bottom: 32px;
  height: 400px;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  overflow: hidden;
  margin-bottom: 32px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td { padding: 16px 24px; text-align: left; border-bottom: 1px solid ${theme.colors.gray200}; }
  th { background: ${theme.colors.gray100}; color: ${theme.colors.gray600}; font-weight: 600; font-size: 13px; text-transform: uppercase; }
  tr:last-child td { border-bottom: none; }
`;

const Revenue: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [topEvents, setTopEvents] = useState<any[]>([]);
  const [topOrganizers, setTopOrganizers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const [statsRes, analyticsRes, eventsRes, orgRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/admin/dashboard-stats`, { headers }),
          axios.get(`${API_BASE_URL}/admin/revenue-analytics`, { headers }),
          axios.get(`${API_BASE_URL}/admin/events`, { headers }),
          axios.get(`${API_BASE_URL}/admin/organizers`, { headers })
        ]);
        
        setStats(statsRes.data);
        setAnalytics(analyticsRes.data);
        
        // Compute Top Events
        const events = eventsRes.data.map((e: any) => ({
          ...e,
          revenue: (e.ticketsSold || 0) * (e.ticketPrice || 0)
        })).sort((a: any, b: any) => b.revenue - a.revenue).slice(0, 5);
        setTopEvents(events);

        // Compute Top Organizers
        const orgs = orgRes.data.sort((a: any, b: any) => b.totalRevenue - a.totalRevenue).slice(0, 5);
        setTopOrganizers(orgs);
        
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading comprehensive revenue data...</div>;

  return (
    <Container>
      <Header>
        <h1>Revenue Intelligence</h1>
        <p>Comprehensive financial analytics across the platform</p>
      </Header>

      <Grid>
        <StatCard highlight>
          <h3>Total Lifetime Revenue</h3>
          <div className="value">₹{stats?.totalRevenue?.toLocaleString() || 0}</div>
        </StatCard>
        <StatCard>
          <h3>Revenue Today</h3>
          <div className="value" style={{ color: theme.colors.gold }}>₹{stats?.todaysRevenue?.toLocaleString() || 0}</div>
        </StatCard>
        <StatCard>
          <h3>Revenue This Month</h3>
          <div className="value" style={{ color: theme.colors.success }}>₹{stats?.thisMonthRevenue?.toLocaleString() || 0}</div>
        </StatCard>
        <StatCard>
          <h3>Total Tickets Sold</h3>
          <div className="value">{stats?.totalTicketsSold?.toLocaleString() || 0}</div>
        </StatCard>
      </Grid>

      <SectionTitle>Daily Revenue (Last 30 Days)</SectionTitle>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analytics?.dailyRevenue || []}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.colors.gray200} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke={theme.colors.gray500} />
            <YAxis tick={{ fontSize: 12 }} stroke={theme.colors.gray500} tickFormatter={(value) => `₹${value}`} />
            <Tooltip cursor={{ fill: theme.colors.gray100 }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="revenue" fill={theme.colors.gold} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
        <div>
          <SectionTitle>Top Events By Revenue</SectionTitle>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Tickets Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topEvents.map(e => (
                  <tr key={e._id}>
                    <td style={{ fontWeight: 600, color: theme.colors.coffeeDark }}>{e.eventName}</td>
                    <td>{e.ticketsSold}</td>
                    <td style={{ fontWeight: 'bold', color: theme.colors.success }}>₹{e.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </div>

        <div>
          <SectionTitle>Top Organizers By Revenue</SectionTitle>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>Organizer Name</th>
                  <th>Events</th>
                  <th>Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topOrganizers.map(o => (
                  <tr key={o._id}>
                    <td style={{ fontWeight: 600, color: theme.colors.coffeeDark }}>{o.name || o.email_address_manager}</td>
                    <td>{o.totalEvents}</td>
                    <td style={{ fontWeight: 'bold', color: theme.colors.success }}>₹{o.totalRevenue?.toLocaleString() || 0}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </Container>
  );
};

export default Revenue;
