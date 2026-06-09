// Stat Card Component
import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { abbreviateNumber, formatPercentage, isPositiveTrend } from '../../utils/formatters';
import { motion } from 'framer-motion';

const Card = styled(motion.div)`
  background: ${theme.colors.white};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all ${theme.transitions.base};

  &:hover {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.gray600};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Icon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: ${theme.colors.creamLight};
`;

const Value = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
`;

const Number = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: ${theme.colors.coffeeDark};
`;

const Trend = styled.span<{ isPositive: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.isPositive ? theme.colors.success : theme.colors.error)};
`;

const TrendLabel = styled.span`
  font-size: 12px;
  color: ${theme.colors.gray600};
`;

const Chart = styled.div`
  height: 40px;
  background: linear-gradient(90deg, ${theme.colors.creamLight}, ${theme.colors.goldLight});
  border-radius: 12px;
`;

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  trend?: number;
  trendLabel?: string;
  showChart?: boolean;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendLabel = 'vs last month',
  showChart = false,
  delay = 0,
}) => {
  const positive = trend !== undefined ? isPositiveTrend(trend) : false;

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
    >
      <Header>
        <Title>{title}</Title>
        <Icon>{icon}</Icon>
      </Header>

      <Value>
        <Number>{abbreviateNumber(value)}</Number>
        {trend !== undefined && (
          <>
            <Trend isPositive={positive}>
              {positive ? '↑' : '↓'} {formatPercentage(Math.abs(trend))}
            </Trend>
            <TrendLabel>{trendLabel}</TrendLabel>
          </>
        )}
      </Value>

      {showChart && <Chart />}
    </Card>
  );
};

export default StatCard;
