// Tickets Page
import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { ticketsApi } from '../services/ticketsApi';
import { usePagination } from '../hooks';
import { Ticket } from '../types';
import { formatDate, getStatusColor } from '../utils/formatters';
import { Badge } from '../components/UI';
import { motion } from 'framer-motion';

const Container = styled(motion.div)`
  max-width: ${theme.componentSizes.containerMaxWidth};
  margin: 0 auto;
`;

const Title = styled.h1`
  margin: 0 0 24px 0;
  color: ${theme.colors.coffeeDark};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${theme.colors.white};
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  th {
    padding: 16px;
    text-align: left;
    background: ${theme.colors.cream};
    font-weight: 600;
  }

  td {
    padding: 16px;
    border-bottom: 1px solid ${theme.colors.gray100};
    font-size: 14px;
  }

  tbody tr:hover {
    background: ${theme.colors.creamLight};
  }
`;

const TicketCode = styled.code`
  background: ${theme.colors.cream};
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
`;

const Tickets: React.FC = () => {
  const { items: tickets } = usePagination<Ticket>(
    (p, ps, f) => ticketsApi.getAllTickets(p, ps, f),
    10
  );

  return (
    <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Title>Tickets</Title>

      <Table>
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Event</th>
            <th>User</th>
            <th>Amount</th>
            <th>QR Status</th>
            <th>Check-In Status</th>
            <th>Generated Date</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>
                <TicketCode>{ticket.ticketCode.slice(0, 12)}...</TicketCode>
              </td>
              <td>{ticket.id}</td>
              <td>{ticket.userName}</td>
              <td>₹{ticket.amount}</td>
              <td>
                <Badge variant={ticket.qrStatus === 'GENERATED' ? 'info' : 'success'}>
                  {ticket.qrStatus}
                </Badge>
              </td>
              <td>
                <Badge variant={ticket.checkInStatus === 'CHECKED_IN' ? 'success' : 'warning'}>
                  {ticket.checkInStatus}
                </Badge>
              </td>
              <td>{formatDate(ticket.generatedDate, 'short')}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Tickets;
