// Analytics Page
import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { motion } from 'framer-motion';

const Container = styled(motion.div)`
  max-width: ${theme.componentSizes.containerMaxWidth};
  margin: 0 auto;
`;

const Title = styled.h1`
  margin: 0 0 24px 0;
  color: ${theme.colors.coffeeDark};
`;

const Section = styled.div`
  background: ${theme.colors.white};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 16px 0;
  color: ${theme.colors.coffeeDark};
`;

const Analytics: React.FC = () => {
  return (
    <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Title>Analytics & Insights</Title>

      <Section>
        <SectionTitle>Top Events</SectionTitle>
        <p>Top events ranking will be displayed here</p>
      </Section>

      <Section>
        <SectionTitle>Top Organizers</SectionTitle>
        <p>Top organizers by revenue and events will be displayed here</p>
      </Section>

      <Section>
        <SectionTitle>Top Cafes</SectionTitle>
        <p>Top performing cafes will be displayed here</p>
      </Section>

      <Section>
        <SectionTitle>Peak Booking Times</SectionTitle>
        <p>Heatmap of booking times will be displayed here</p>
      </Section>
    </Container>
  );
};

export default Analytics;
