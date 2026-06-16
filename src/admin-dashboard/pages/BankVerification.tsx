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
  margin-bottom: 24px;
  h1 { color: ${theme.colors.coffeeDark}; font-size: 28px; font-weight: 700; }
  p { color: ${theme.colors.gray600}; font-size: 15px; margin-top: 4px; }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  border-bottom: 2px solid ${theme.colors.gray200};
`;

const Tab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.active ? theme.colors.gold : theme.colors.gray500};
  border-bottom: 3px solid ${props => props.active ? theme.colors.gold : 'transparent'};
  cursor: pointer;
  margin-bottom: -2px;
  &:hover { color: ${theme.colors.gold}; }
`;

const TableCard = styled.div`
  background: ${theme.colors.white};
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td { padding: 16px; text-align: left; border-bottom: 1px solid ${theme.colors.gray200}; }
  th { background: ${theme.colors.gray100}; font-weight: 600; color: ${theme.colors.gray600}; font-size: 13px; text-transform: uppercase; }
`;

const ActionButton = styled.button<{ variant?: 'success' | 'danger' }>`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 13px;
  background: ${props => props.variant === 'success' ? theme.colors.success : props.variant === 'danger' ? theme.colors.warning : theme.colors.gray200};
  color: ${props => props.variant ? 'white' : theme.colors.gray800};
  margin-right: 8px;
`;

const BankVerification: React.FC = () => {
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');

  const fetchOrganizers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/admin/organizers`, { headers: { Authorization: `Bearer ${token}` }});
      setOrganizers(res.data);
    } catch (error) { toast.error("Failed to load organizers"); } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrganizers(); }, []);

  const handleApprove = async (id: string) => {
    if(!window.confirm("Approve this organizer?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/admin/approve-cafe/${id}`, {}, { headers: { Authorization: `Bearer ${token}` }});
      toast.success("Organizer approved!");
      fetchOrganizers();
    } catch (error) { toast.error("Failed to approve"); }
  };

  const handleReject = async (id: string) => {
    if(!window.confirm("Reject this organizer? This will delete their account.")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/admin/reject-cafe/${id}`, { headers: { Authorization: `Bearer ${token}` }});
      toast.success("Organizer rejected and removed.");
      fetchOrganizers();
    } catch (error) { toast.error("Failed to reject"); }
  };

  const filteredOrganizers = organizers.filter(o => o.status === activeTab);

  if (loading) return <div>Loading verification center...</div>;

  return (
    <Container>
      <Header>
        <h1>Organizer & Bank Verification</h1>
        <p>Review and approve organizers to allow them to create paid events</p>
      </Header>

      <TabContainer>
        <Tab active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>Pending Approval</Tab>
        <Tab active={activeTab === 'approved'} onClick={() => setActiveTab('approved')}>Approved Organizers</Tab>
      </TabContainer>

      <TableCard>
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <thead>
              <tr>
                <th>Organizer Name</th>
                <th>Email & Phone</th>
                <th>Bank / UPI</th>
                <th>Account Info</th>
                <th>Documents</th>
                {activeTab === 'pending' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredOrganizers.map(o => (
                <tr key={o._id}>
                  <td style={{ fontWeight: 600 }}>{o.name || o.email_address_manager}</td>
                  <td>
                    <div>{o.email_address_manager}</div>
                    <div style={{ fontSize: '13px', color: theme.colors.gray600 }}>{o.Phonenumber}</div>
                  </td>
                  <td>
                    {o.upiId ? <div>UPI: {o.upiId}</div> : null}
                    {o.bankName ? <div>Bank: {o.bankName}</div> : null}
                    {!o.upiId && !o.bankName && <span style={{ color: theme.colors.gray500 }}>No Bank Info</span>}
                  </td>
                  <td>
                    {o.accountNumber ? <div>A/C: {o.accountNumber}</div> : null}
                    {o.ifscCode ? <div>IFSC: {o.ifscCode}</div> : null}
                  </td>
                  <td>
                    {o.idProof ? <a href={o.idProof} target="_blank" rel="noreferrer" style={{ color: theme.colors.gold, fontWeight: 'bold' }}>View ID</a> : <span style={{ color: theme.colors.gray500 }}>No Doc</span>}
                  </td>
                  {activeTab === 'pending' && (
                    <td>
                      <ActionButton variant="success" onClick={() => handleApprove(o._id)}>Approve</ActionButton>
                      <ActionButton variant="danger" onClick={() => handleReject(o._id)}>Reject</ActionButton>
                    </td>
                  )}
                </tr>
              ))}
              {filteredOrganizers.length === 0 && (
                <tr><td colSpan={6}>No {activeTab} organizers found.</td></tr>
              )}
            </tbody>
          </Table>
        </div>
      </TableCard>
    </Container>
  );
};

export default BankVerification;
