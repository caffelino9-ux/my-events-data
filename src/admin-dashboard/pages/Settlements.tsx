import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const Container = styled.div`
  max-width: ${theme.componentSizes.containerMaxWidth};
  margin: 0 auto;
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

  th, td { padding: 16px 24px; text-align: left; border-bottom: 1px solid ${theme.colors.gray200}; white-space: nowrap; color: ${theme.colors.gray800}; }
  th { background: ${theme.colors.gray100}; color: ${theme.colors.gray600}; font-weight: 600; font-size: 14px; text-transform: uppercase; }
  tr:last-child td { border-bottom: none; }
`;

const Settlements: React.FC = () => {
  const [settlements, setSettlements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/admin/settlements`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSettlements(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettlements();
  }, []);

  if (loading) return <div>Loading settlements data...</div>;

  return (
    <Container>
      <h1 style={{ color: theme.colors.coffeeDark, marginBottom: '24px' }}>Organizer Settlements</h1>
      
      <TableCard>
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <thead>
              <tr>
                <th>Organizer</th>
                <th>Event</th>
                <th>Account Holder Name</th>
                <th>Payment Mobile Number</th>
                <th>UPI ID</th>
                <th>Amount Payable (90%)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {settlements.map((s) => (
                <tr key={s._id}>
                  <td style={{ fontWeight: '600' }}>{s.organizerName}</td>
                  <td>{s.eventName}</td>
                  <td>{s.bankDetails?.accountHolderName || s.bankDetails?.accountHolder || 'N/A'}</td>
                  <td>{s.bankDetails?.paymentMobileNumber || s.bankDetails?.phoneNumber || 'N/A'}</td>
                  <td>{s.bankDetails?.upiId || s.bankDetails?.upi || 'N/A'}</td>
                  <td style={{ fontWeight: 'bold', color: theme.colors.success }}>₹{s.amountPayable.toLocaleString()}</td>
                  <td>
                    <span style={{ color: s.status === 'Paid' ? theme.colors.success : theme.colors.warning, fontWeight: 'bold' }}>
                      {s.status}
                    </span>
                  </td>
                  <td>
                    <button style={{ 
                      padding: '6px 12px', 
                      background: s.status === 'Paid' ? theme.colors.gray300 : theme.colors.gold, 
                      color: s.status === 'Paid' ? theme.colors.gray600 : 'white', 
                      border: 'none', borderRadius: '6px', cursor: s.status === 'Paid' ? 'not-allowed' : 'pointer'
                    }}>
                      {s.status === 'Paid' ? 'Settled' : 'Mark Paid'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </TableCard>
    </Container>
  );
};

export default Settlements;
