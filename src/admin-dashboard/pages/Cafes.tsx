// Cafes Management Page
import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { cafesApi } from '../services/cafesApi';
import { usePagination } from '../hooks';
import { Cafe } from '../types';
import { formatCurrency, getStatusColor } from '../utils/formatters';
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
  }

  tbody tr:hover {
    background: ${theme.colors.creamLight};
  }
`;

const Cafes: React.FC = () => {
  const { items: cafes } = usePagination<Cafe>(
    (p, ps, f) => cafesApi.getAllCafes(p, ps, f),
    10
  );

  return (
    <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Title>Cafes</Title>

      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Events Hosted</th>
            <th>Revenue Generated</th>
            <th>Avg Attendance</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {cafes.map((cafe) => (
            <tr key={cafe.id}>
              <td>{cafe.name}</td>
              <td>{cafe.location}</td>
              <td>{cafe.eventsHosted}</td>
              <td>{formatCurrency(cafe.revenueGenerated)}</td>
              <td>{cafe.averageAttendance}</td>
              <td>
                <Badge variant={getStatusColor(cafe.status)}>
                  {cafe.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Cafes;
