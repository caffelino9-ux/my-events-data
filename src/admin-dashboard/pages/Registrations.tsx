import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const Container = styled.div`
  max-width: ${theme.componentSizes.containerMaxWidth};
  margin: 0 auto;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

const Tab = styled.button<{ active: boolean }>`
  background: ${props => props.active ? theme.colors.gold : theme.colors.white};
  color: ${props => props.active ? theme.colors.coffeeDark : theme.colors.gray600};
  border: 1px solid ${props => props.active ? theme.colors.gold : theme.colors.gray300};
  padding: 10px 24px;
  border-radius: 9999px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? theme.colors.gold : theme.colors.gray100};
  }
`;

const TableCard = styled.div`
  background: ${theme.colors.white};
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  overflow: hidden;
`;

const Table = styled.table`
  width: max-content;
  min-width: 100%;
  border-collapse: collapse;

  th, td { padding: 16px 24px; text-align: left; border-bottom: 1px solid ${theme.colors.gray200}; white-space: nowrap; }
  th { background: ${theme.colors.gray100}; color: ${theme.colors.gray600}; font-weight: 600; font-size: 14px; text-transform: uppercase; }
  td { color: ${theme.colors.gray800}; }
  tr:last-child td { border-bottom: none; }
`;

const ControlsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;

  input, select {
    padding: 10px 16px;
    border: 1px solid ${theme.colors.gray300};
    border-radius: 8px;
    outline: none;
    min-width: 200px;
    &:focus { border-color: ${theme.colors.gold}; }
  }
`;

const Registrations: React.FC = () => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Free' | 'Paid'>('All');

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('All Time');

  useEffect(() => {
    const fetchRegs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/admin/registrations`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        });
        setRegistrations(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRegs();
  }, []);

  const filteredRegs = registrations.filter(r => {
    // Tab
    if (activeTab === 'Free' && r.amountPaid > 0) return false;
    if (activeTab === 'Paid' && r.amountPaid === 0) return false;
    
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!(r.userName?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q) || r.phone?.includes(q))) {
        return false;
      }
    }
    
    // Date
    if (dateFilter !== 'All Time') {
      const regDate = new Date(r.registrationDate);
      const today = new Date();
      if (dateFilter === 'Today') {
        if (regDate.toDateString() !== today.toDateString()) return false;
      } else if (dateFilter === 'This Week') {
        const weekAgo = new Date(today.setDate(today.getDate() - 7));
        if (regDate < weekAgo) return false;
      } else if (dateFilter === 'This Month') {
        const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
        if (regDate < monthAgo) return false;
      }
    }

    return true;
  });

  if (loading) return <div>Loading registrations...</div>;

  return (
    <Container>
      <h1 style={{ color: theme.colors.coffeeDark, marginBottom: '24px' }}>Registrations</h1>
      
      <TabContainer>
        <Tab active={activeTab === 'All'} onClick={() => setActiveTab('All')}>All Registrations</Tab>
        <Tab active={activeTab === 'Free'} onClick={() => setActiveTab('Free')}>Free Registrations</Tab>
        <Tab active={activeTab === 'Paid'} onClick={() => setActiveTab('Paid')}>Paid Registrations</Tab>
      </TabContainer>

      <ControlsRow>
        <input 
          type="text" 
          placeholder="Search by Name, Email, or Phone" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1 }}
        />
        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          <option value="All Time">All Time</option>
          <option value="Today">Today</option>
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
        </select>
        <button style={{ background: theme.colors.coffeeDark, color: 'white', padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => window.open(`${API_BASE_URL}/admin/export/registrations`, '_blank')}>
          Export CSV
        </button>
      </ControlsRow>

      <TableCard>
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>Event Name</th>
                <th>Ticket Type</th>
                <th>Amount</th>
                <th>Payment Status</th>
                <th>Registration Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegs.map((r) => (
                <tr key={r._id}>
                  <td style={{ fontWeight: '600' }}>{r.userName}</td>
                  <td>{r.email}</td>
                  <td>{r.phone}</td>
                  <td>{r.gender || 'Not Specified'}</td>
                  <td>{r.eventId?.eventName || 'Deleted Event'}</td>
                  <td>
                    <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, background: r.amountPaid > 0 ? 'rgba(212, 175, 55, 0.1)' : 'rgba(46, 204, 113, 0.1)', color: r.amountPaid > 0 ? theme.colors.gold : theme.colors.success }}>
                      {r.amountPaid > 0 ? 'Paid' : 'Free'}
                    </span>
                  </td>
                  <td style={{ color: r.amountPaid > 0 ? theme.colors.success : theme.colors.gray600, fontWeight: 'bold' }}>₹{r.amountPaid}</td>
                  <td style={{ textTransform: 'uppercase', fontWeight: 600, color: r.paymentStatus === 'Completed' ? theme.colors.success : theme.colors.warning }}>
                    {r.paymentStatus}
                  </td>
                  <td>{new Date(r.registrationDate).toLocaleString()}</td>
                </tr>
              ))}
              {filteredRegs.length === 0 && <tr><td colSpan={9}>No registrations found.</td></tr>}
            </tbody>
          </Table>
        </div>
      </TableCard>
    </Container>
  );
};

export default Registrations;
