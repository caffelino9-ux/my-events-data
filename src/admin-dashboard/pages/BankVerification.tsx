// Bank Verification Center Page
import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { verificationApi } from '../services/verificationApi';
import { usePagination } from '../hooks';
import { BankDetails } from '../types';
import { maskAccountNumber, getStatusColor } from '../utils/formatters';
import { Button, Badge } from '../components/UI';
import { motion } from 'framer-motion';

const Container = styled(motion.div)`
  max-width: ${theme.componentSizes.containerMaxWidth};
  margin: 0 auto;
`;

const Title = styled.h1`
  margin: 0 0 24px 0;
  font-size: 30px;
  color: ${theme.colors.coffeeDark};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${theme.colors.white};
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  thead {
    background: ${theme.colors.cream};
  }

  th {
    padding: 16px;
    text-align: left;
    font-weight: 600;
    color: ${theme.colors.coffeeDark};
  }

  td {
    padding: 16px;
    border-bottom: 1px solid ${theme.colors.gray100};
  }

  tbody tr:hover {
    background: ${theme.colors.creamLight};
  }
`;

const AccountNumber = styled.code`
  background: ${theme.colors.cream};
  padding: 4px 8px;
  border-radius: 4px;
  font-family: ${theme.typography.fontFamilyMono};
  font-size: 12px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const BankVerification: React.FC = () => {
  const { items: verifications } = usePagination<BankDetails>(
    (p, ps, f) => verificationApi.getAllVerifications(p, ps, f),
    10
  );

  return (
    <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Title>Bank Verification Center</Title>

      <Table>
        <thead>
          <tr>
            <th>Organizer</th>
            <th>Bank Name</th>
            <th>Account Number</th>
            <th>IFSC</th>
            <th>PAN</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {verifications.map((verification) => (
            <tr key={verification.id}>
              <td>{verification.accountHolderName}</td>
              <td>{verification.bankName}</td>
              <td>
                <AccountNumber>{maskAccountNumber(verification.accountNumber)}</AccountNumber>
              </td>
              <td>{verification.ifscCode}</td>
              <td>{verification.panNumber}</td>
              <td>
                <Badge variant={getStatusColor(verification.verificationStatus)}>
                  {verification.verificationStatus}
                </Badge>
              </td>
              <td>
                <Actions>
                  <Button variant="success" size="small">
                    Approve
                  </Button>
                  <Button variant="danger" size="small">
                    Reject
                  </Button>
                </Actions>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default BankVerification;
