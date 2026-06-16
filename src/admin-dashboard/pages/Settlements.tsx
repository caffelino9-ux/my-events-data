import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import toast from 'react-hot-toast';

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

const ActionButton = styled.button`
  background: ${theme.colors.coffeeDark};
  color: ${theme.colors.cream};
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  font-size: 12px;
  &:hover { background: ${theme.colors.coffeeMedium}; }
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

  const fetchSettlements = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/admin/settlements`, { headers: { Authorization: `Bearer ${token}` }});
      setSettlements(res.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchSettlements(); }, []);

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`${API_BASE_URL}/admin/export/settlements?token=${token}`, '_blank');
  };

  const handleMarkPaid = async (id: string) => {
    const utr = prompt("Enter UTR / Reference Number for this payment:");
    if (!utr) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/admin/settlement/${id}/status`, 
        { status: 'Paid', utrNumber: utr }, 
        { headers: { Authorization: `Bearer ${token}` }}
      );
      toast.success("Settlement marked as Paid!");
      fetchSettlements();
    } catch (error) { toast.error("Failed to update settlement."); }
  };

  if (loading) return <div>Loading settlements...</div>;

  return (
    <Container>
      <Header>
        <Title>Settlements Management</Title>
        <Button onClick={handleExport}>Export CSV</Button>
      </Header>
      <TableCard>
        <Table>
          <thead>
            <tr>
              <th>Event</th>
              <th>Organizer</th>
              <th>Tickets Sold</th>
              <th>Paid Users</th>
              <th>Free Users</th>
              <th>Revenue</th>
              <th>Platform Fee</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {settlements.map(s => (
              <tr key={s._id}>
                <td style={{ fontWeight: 600 }}>{s.eventId?.eventName}</td>
                <td>
                  <div>{s.organizerId?.name}</div>
                  <div style={{ fontSize: '12px', color: theme.colors.gray600 }}>{s.organizerId?.Phonenumber}</div>
                </td>
                <td>{s.ticketsSold}</td>
                <td style={{ color: theme.colors.success, fontWeight: 600 }}>{s.paidUsers}</td>
                <td style={{ color: theme.colors.gray600 }}>{s.freeUsers}</td>
                <td>₹{s.totalRevenue}</td>
                <td style={{ color: theme.colors.warning }}>-₹{s.platformFeeAmount}</td>
                <td style={{ fontWeight: 'bold', color: theme.colors.success }}>₹{s.amountPayable}</td>
                <td>
                  <StatusBadge status={s.status}>{s.status}</StatusBadge>
                  {s.utrNumber && <div style={{ fontSize: '11px', marginTop: '4px' }}>UTR: {s.utrNumber}</div>}
                </td>
                <td style={{ color: theme.colors.gray600 }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                <td>
                  {s.status !== 'Paid' && (
                    <ActionButton onClick={() => handleMarkPaid(s._id)}>Mark Paid</ActionButton>
                  )}
                </td>
              </tr>
            ))}
            {settlements.length === 0 && <tr><td colSpan={10}>No settlements found.</td></tr>}
          </tbody>
        </Table>
      </TableCard>
    </Container>
  );
};

export default Settlements;
