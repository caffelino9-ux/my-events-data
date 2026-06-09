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
  tr:hover { background: ${theme.colors.gray100}; }
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.status === 'Success' ? 'rgba(46, 204, 113, 0.1)' : props.status === 'Failed' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(243, 156, 18, 0.1)'};
  color: ${props => props.status === 'Success' ? theme.colors.success : props.status === 'Failed' ? '#FF6B6B' : theme.colors.warning};
`;

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/admin/payments`, { headers: { Authorization: `Bearer ${token}` }});
        setPayments(res.data);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchPayments();
  }, []);

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`${API_BASE_URL}/admin/export/payments?token=${token}`, '_blank');
  };

  if (loading) return <div>Loading payments...</div>;

  return (
    <Container>
      <Header>
        <Title>Platform Payments</Title>
        <Button onClick={handleExport}>Export CSV</Button>
      </Header>
      <TableCard>
        <Table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Event</th>
              <th>Organizer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p._id}>
                <td style={{ fontFamily: 'monospace' }}>{p.transactionId}</td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td>{p.eventId?.eventName}</td>
                <td>{p.organizerId?.name}</td>
                <td style={{ fontWeight: 'bold' }}>{p.currency} {p.amount}</td>
                <td><StatusBadge status={p.status}>{p.status}</StatusBadge></td>
              </tr>
            ))}
            {payments.length === 0 && <tr><td colSpan={6}>No payments found.</td></tr>}
          </tbody>
        </Table>
      </TableCard>
    </Container>
  );
};

export default Payments;
