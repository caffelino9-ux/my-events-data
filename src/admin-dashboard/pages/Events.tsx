import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import toast from 'react-hot-toast';

const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
`;

const Controls = styled.div`
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

const TableCard = styled.div`
  background: ${theme.colors.white};
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  overflow: hidden;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  max-width: 100%;
  color: ${theme.colors.gray800};
`;

const Table = styled.table`
  width: max-content;
  border-collapse: collapse;

  th, td { 
    padding: 12px 16px; 
    text-align: left; 
    border-bottom: 1px solid ${theme.colors.gray200}; 
    font-size: 13px;
    white-space: nowrap;
    color: ${theme.colors.gray800};
  }
  th { 
    background: ${theme.colors.gray100}; 
    color: ${theme.colors.gray600}; 
    font-weight: 600; 
    text-transform: uppercase; 
  }
  tr:last-child td { border-bottom: none; }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;

  button {
    padding: 6px 12px;
    border-radius: 6px;
    border: none;
    font-weight: bold;
    cursor: pointer;
    font-size: 12px;
  }
  
  .btn-view { background: ${theme.colors.gold}; color: white; }
  .btn-edit { background: ${theme.colors.gray600}; color: white; }
  .btn-delete { background: #FF6B6B; color: white; }
`;

const DrawerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
`;

const Drawer = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 600px;
  background: white;
  z-index: 1001;
  padding: 32px;
  overflow-y: auto;
  box-shadow: -4px 0 15px rgba(0,0,0,0.1);
  transform: translateX(0);

  @media (max-width: 768px) { width: 100%; }

  .close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: ${theme.colors.gray600};
  }

  h2 { color: ${theme.colors.coffeeDark}; margin-bottom: 24px; border-bottom: 2px solid ${theme.colors.gray200}; padding-bottom: 8px; }
  h3 { color: ${theme.colors.gold}; margin-top: 24px; margin-bottom: 12px; font-size: 16px; }
  p { margin-bottom: 8px; font-size: 14px; color: ${theme.colors.gray800}; }
  .label { font-weight: 600; color: ${theme.colors.gray600}; display: inline-block; width: 150px; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: white;
  padding: 32px;
  border-radius: 12px;
  width: 400px;
  
  h3 { margin-bottom: 16px; }
  select { width: 100%; padding: 12px; margin-bottom: 24px; border-radius: 8px; border: 1px solid ${theme.colors.gray300}; }
  .buttons { display: flex; gap: 12px; justify-content: flex-end; }
  button { padding: 10px 16px; border-radius: 8px; border: none; cursor: pointer; font-weight: bold; }
  .save { background: ${theme.colors.gold}; color: white; }
  .cancel { background: ${theme.colors.gray200}; color: ${theme.colors.gray800}; }
`;

const Events: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Drawer state
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [drawerData, setDrawerData] = useState<any>(null);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editEventId, setEditEventId] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/admin/events`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const openDrawer = async (id: string) => {
    setSelectedEventId(id);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/admin/event/${id}`, { headers: { Authorization: `Bearer ${token}` }});
      setDrawerData(res.data);
    } catch (error) { toast.error("Failed to load event details"); }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("PERMANENTLY DELETE THIS EVENT AND ALL CLOUDINARY IMAGES?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/admin/event/${id}`, { headers: { Authorization: `Bearer ${token}` }});
        toast.success("Event permanently deleted");
        fetchEvents();
      } catch (error) { toast.error("Failed to delete event"); }
    }
  };

  const handleEditStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/admin/event/${editEventId}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` }});
      toast.success("Status updated");
      setEditModalOpen(false);
      fetchEvents();
    } catch (error) { toast.error("Failed to update status"); }
  };

  const filteredEvents = events.filter(e => {
    const matchesSearch = 
      (e.eventName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.organizerName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.city?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.eventCategory?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Map "pending" to "draft" for filter logic since backend uses "draft" for pending review
    const targetStatus = filterStatus === 'pending' ? 'draft' : filterStatus;
    const matchesStatus = filterStatus ? e.status === targetStatus : true;

    return matchesSearch && matchesStatus;
  });

  if (loading) return <div>Loading all platform events...</div>;

  return (
    <Container>
      <h1 style={{ color: theme.colors.coffeeDark, marginBottom: '24px' }}>Master Event Directory</h1>
      
      <Controls>
        <input 
          type="text" 
          placeholder="Search by Event, Organizer, City, Category..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="published">Published</option>
          <option value="pending">Pending Review (Drafts)</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </Controls>

      <TableCard>
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>Banner</th>
                <th>Event Name</th>
                <th>Category</th>
                <th>Organizer Name</th>
                <th>Org Email</th>
                <th>Org Phone</th>
                <th>Instagram</th>
                <th>Cafe Name</th>
                <th>Venue</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>Country</th>
                <th>Date</th>
                <th>Time</th>
                <th>Ticket Price</th>
                <th>Total Seats</th>
                <th>Available</th>
                <th>Sold</th>
                <th>Revenue</th>
                <th>Status</th>
                <th>Created Date</th>
                <th style={{ position: 'sticky', right: 0, background: theme.colors.gray100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((e) => {
                const revenue = (e.ticketsSold || 0) * (e.ticketPrice || 0);
                return (
                  <tr key={e._id}>
                    <td><img src={e.bannerUrl} alt="banner" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '4px' }} /></td>
                    <td style={{ fontWeight: '600' }}>{e.eventName}</td>
                    <td>{e.eventCategory}</td>
                    <td>{e.organizerName}</td>
                    <td>{e.organizerEmail}</td>
                    <td>{e.phoneNumber}</td>
                    <td>{e.eventInstagramId || 'N/A'}</td>
                    <td>{e.cafeName}</td>
                    <td>{e.venueName}</td>
                    <td>{e.address}</td>
                    <td>{e.city}</td>
                    <td>{e.state}</td>
                    <td>{e.country}</td>
                    <td>{new Date(e.eventDate).toLocaleDateString()}</td>
                    <td>{e.startTime} - {e.endTime}</td>
                    <td>₹{e.ticketPrice}</td>
                    <td>{e.maxSeats}</td>
                    <td>{e.availableSeats}</td>
                    <td>{e.ticketsSold || 0}</td>
                    <td style={{ color: theme.colors.success, fontWeight: 'bold' }}>₹{revenue.toLocaleString()}</td>
                    <td style={{ textTransform: 'uppercase', fontWeight: 600 }}>{e.status}</td>
                    <td>{new Date(e.createdAt).toLocaleDateString()}</td>
                    <td style={{ position: 'sticky', right: 0, background: 'white' }}>
                      <Actions>
                        <button className="btn-view" onClick={() => openDrawer(e._id)}>View</button>
                        <button className="btn-edit" onClick={() => { setEditEventId(e._id); setNewStatus(e.status); setEditModalOpen(true); }}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(e._id)}>Delete</button>
                      </Actions>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </TableWrapper>
      </TableCard>

      {/* DRAWER */}
      {selectedEventId && (
        <DrawerOverlay onClick={() => setSelectedEventId(null)}>
          <Drawer onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedEventId(null)}>&times;</button>
            
            {drawerData ? (
              <>
                <h2>{drawerData.event.eventName}</h2>
                <img src={drawerData.event.bannerUrl} alt="banner" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }} />
                
                <h3>Basic Info</h3>
                <p><span className="label">Category:</span> {drawerData.event.eventCategory}</p>
                <p><span className="label">Description:</span> {drawerData.event.eventDescription}</p>

                <h3>Location</h3>
                <p><span className="label">Cafe Name:</span> {drawerData.event.cafeName}</p>
                <p><span className="label">Venue:</span> {drawerData.event.venueName}</p>
                <p><span className="label">Address:</span> {drawerData.event.address}, {drawerData.event.city}, {drawerData.event.state}, {drawerData.event.country} - {drawerData.event.pincode}</p>
                <p><span className="label">Maps:</span> <a href={drawerData.event.googleMapsLink} target="_blank" rel="noreferrer">Open Link</a></p>

                <h3>Date & Time</h3>
                <p><span className="label">Date:</span> {new Date(drawerData.event.eventDate).toLocaleDateString()}</p>
                <p><span className="label">Time:</span> {drawerData.event.startTime} to {drawerData.event.endTime} ({drawerData.event.timezone})</p>

                <h3>Tickets</h3>
                <p><span className="label">Price:</span> ₹{drawerData.event.ticketPrice}</p>
                <p><span className="label">Seats:</span> {drawerData.event.ticketsSold} Sold / {drawerData.event.maxSeats} Total</p>

                <h3>Organizer</h3>
                <p><span className="label">Name:</span> {drawerData.event.organizerName}</p>
                <p><span className="label">Email:</span> {drawerData.event.organizerEmail}</p>
                <p><span className="label">Phone:</span> {drawerData.event.phoneNumber}</p>

                <h3>Settlement Details</h3>
                {drawerData.bankDetails ? (
                  <>
                    <p><span className="label">Account Holder:</span> {drawerData.bankDetails.accountHolderName || drawerData.bankDetails.accountHolder || 'N/A'}</p>
                    <p><span className="label">Bank Name:</span> {drawerData.bankDetails.bankName || 'N/A'}</p>
                    <p><span className="label">Account Number:</span> {drawerData.bankDetails.accountNumber || 'N/A'}</p>
                    <p><span className="label">IFSC Code:</span> {drawerData.bankDetails.ifscCode || drawerData.bankDetails.ifsc || 'N/A'}</p>
                    <p><span className="label">UPI ID:</span> {drawerData.bankDetails.upiId || drawerData.bankDetails.upi || 'N/A'}</p>
                  </>
                ) : (
                  <p><span className="label">Bank Info:</span> Not provided or Invalid</p>
                )}
              </>
            ) : (
              <p>Loading details...</p>
            )}
          </Drawer>
        </DrawerOverlay>
      )}

      {/* EDIT MODAL */}
      {editModalOpen && (
        <ModalOverlay>
          <Modal>
            <h3>Update Event Status</h3>
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              <option value="draft">Pending Review (Draft)</option>
              <option value="published">Published</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="buttons">
              <button className="cancel" onClick={() => setEditModalOpen(false)}>Cancel</button>
              <button className="save" onClick={handleEditStatus}>Save Changes</button>
            </div>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Events;
