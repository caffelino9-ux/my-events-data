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

import { useNavigate } from 'react-router-dom';

const Events: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

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

  const handlePause = async (id: string) => {
    if (window.confirm("Pause this event? This will change status to cancelled/suspended.")) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`${API_BASE_URL}/admin/event/${id}/suspend`, {}, { headers: { Authorization: `Bearer ${token}` }});
        toast.success("Event paused");
        fetchEvents();
      } catch (error) { toast.error("Failed to pause event"); }
    }
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
                <th>Event Name</th>
                <th>Organizer Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Capacity</th>
                <th>Tickets Sold</th>
                <th>Remaining</th>
                <th>Revenue</th>
                <th>Registrations</th>
                <th>Check-ins</th>
                <th>Created Date</th>
                <th style={{ position: 'sticky', right: 0, background: theme.colors.gray100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((e) => {
                const revenue = (e.ticketsSold || 0) * (e.ticketPrice || 0);
                return (
                  <tr key={e._id}>
                    <td style={{ fontWeight: '600' }}>{e.eventName}</td>
                    <td>{e.organizerName}</td>
                    <td>{new Date(e.eventDate).toLocaleDateString()}</td>
                    <td style={{ textTransform: 'uppercase', fontWeight: 600 }}>
                      <span style={{ 
                        background: e.status === 'published' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(241, 196, 15, 0.1)',
                        color: e.status === 'published' ? theme.colors.success : theme.colors.warning,
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px'
                      }}>
                        {e.status}
                      </span>
                    </td>
                    <td>{e.maxSeats}</td>
                    <td>{e.ticketsSold || 0}</td>
                    <td>{(e.maxSeats || 0) - (e.ticketsSold || 0)}</td>
                    <td style={{ color: theme.colors.success, fontWeight: 'bold' }}>₹{revenue.toLocaleString()}</td>
                    <td>{e.registrationCount || 0}</td>
                    <td>{e.checkInsCount || 0}</td>
                    <td>{new Date(e.createdAt).toLocaleDateString()}</td>
                    <td style={{ position: 'sticky', right: 0, background: 'white' }}>
                      <Actions>
                        <button className="btn-view" onClick={() => navigate(`/admin/event/${e._id}`)}>View Details</button>
                        <button className="btn-edit" onClick={() => { setEditEventId(e._id); setNewStatus(e.status); setEditModalOpen(true); }}>Edit</button>
                        <button className="btn-edit" style={{ background: theme.colors.warning }} onClick={() => handlePause(e._id)}>Pause</button>
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
