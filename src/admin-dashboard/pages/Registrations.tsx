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

const Registrations: React.FC = () => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Free' | 'Paid'>('All');

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
    if (activeTab === 'Free') return r.amountPaid === 0;
    if (activeTab === 'Paid') return r.amountPaid > 0;
    return true; // All
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

      <TableCard>
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Event Name</th>
                <th>Registration Type</th>
                <th>Amount</th>
                <th>Payment Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegs.map((r) => (
                <tr key={r._id}>
                  <td style={{ fontWeight: '600' }}>{r.userName}</td>
                  <td>{r.email}</td>
                  <td>{r.phone}</td>
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
                  <td>{new Date(r.registrationDate).toLocaleDateString()}</td>
                </tr>
              ))}
              {filteredRegs.length === 0 && <tr><td colSpan={8}>No registrations found.</td></tr>}
            </tbody>
          </Table>
        </div>
      </TableCard>
    </Container>
  );
};

export default Registrations;
