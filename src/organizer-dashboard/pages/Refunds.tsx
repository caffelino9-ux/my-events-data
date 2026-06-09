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

const Refunds: React.FC = () => {
  const [refunds, setRefunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/events/refunds`, { headers: { Authorization: `Bearer ${token}` }});
        if (res.data.success) {
          setRefunds(res.data.refunds || []);
        }
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchRefunds();
  }, []);

  if (loading) return <div>Loading refunds...</div>;

  return (
    <Container>
      <Header>
        <Title>Refunds</Title>
      </Header>
      <TableCard>
        <Table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {refunds.map(r => (
              <tr key={r._id}>
                <td>{r.registrationId?.ticketNumber}</td>
                <td>{r.userId?.name}</td>
                <td style={{ fontWeight: 'bold' }}>₹{r.amount}</td>
                <td>{r.reason}</td>
                <td>{r.status}</td>
              </tr>
            ))}
            {refunds.length === 0 && <tr><td colSpan={5}>No refunds found.</td></tr>}
          </tbody>
        </Table>
      </TableCard>
    </Container>
  );
};

export default Refunds;
