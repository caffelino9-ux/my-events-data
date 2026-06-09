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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  color: ${theme.colors.coffeeDark};
  font-size: 24px;
`;

const Button = styled.button`
  background: ${theme.colors.gold};
  color: ${theme.colors.coffeeDark};
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  &:hover { background: #E5C354; }
`;

const TableCard = styled.div`
  background: ${theme.colors.white};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td { padding: 16px; text-align: left; border-bottom: 1px solid ${theme.colors.gray200}; }
  th { background: ${theme.colors.gray100}; font-weight: 600; color: ${theme.colors.gray600}; font-size: 13px; text-transform: uppercase; }
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.status === 'Paid' ? 'rgba(46, 204, 113, 0.1)' : props.status === 'Processing' ? 'rgba(243, 156, 18, 0.1)' : 'rgba(149, 165, 166, 0.1)'};
  color: ${props => props.status === 'Paid' ? theme.colors.success : props.status === 'Processing' ? theme.colors.warning : theme.colors.gray600};
`;

const Settlements: React.FC = () => {
  const [settlements, setSettlements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/events/settlements`, { headers: { Authorization: `Bearer ${token}` }});
        if (res.data.success) {
          setSettlements(res.data.settlements);
        }
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchSettlements();
  }, []);

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`${API_BASE_URL}/events/export/settlements?token=${token}`, '_blank');
  };

  if (loading) return <div>Loading settlements...</div>;

  return (
    <Container>
      <Header>
        <Title>Payout History</Title>
        <Button onClick={handleExport}>Export CSV</Button>
      </Header>
      <TableCard>
        <Table>
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Total Revenue</th>
              <th>Platform Fee (5%)</th>
              <th>Amount Paid</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {settlements.map(s => (
              <tr key={s._id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{s.eventId?.eventName}</div>
                  <div style={{ fontSize: '12px', color: theme.colors.gray600 }}>{s.eventId?.ticketsSold} Tickets Sold</div>
                </td>
                <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                <td>₹{s.totalRevenue}</td>
                <td style={{ color: theme.colors.warning }}>-₹{s.platformFeeAmount}</td>
                <td style={{ fontWeight: 'bold', color: theme.colors.success }}>₹{s.amountPayable}</td>
                <td>
                  <StatusBadge status={s.status}>{s.status}</StatusBadge>
                  {s.utrNumber && <div style={{ fontSize: '11px', marginTop: '4px' }}>UTR: {s.utrNumber}</div>}
                </td>
              </tr>
            ))}
            {settlements.length === 0 && <tr><td colSpan={6}>No payouts found.</td></tr>}
          </tbody>
        </Table>
      </TableCard>
    </Container>
  );
};

export default Settlements;
