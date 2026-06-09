// Users Management Page
import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { usersApi } from '../services/usersApi';
import { usePagination } from '../hooks';
import { User } from '../types';
import { formatCurrency } from '../utils/formatters';
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
  }

  tbody tr:hover {
    background: ${theme.colors.creamLight};
  }
`;

const Users: React.FC = () => {
  const { items: users } = usePagination<User>(
    (p, ps, f) => usersApi.getAllUsers(p, ps, f),
    10
  );

  return (
    <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Title>Users</Title>

      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Events Joined</th>
            <th>Tickets Purchased</th>
            <th>Total Spend</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.eventsJoined}</td>
              <td>{user.ticketsPurchased}</td>
              <td>{formatCurrency(user.totalSpend)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Users;
