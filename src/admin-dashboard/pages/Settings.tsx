// Settings Page
import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { dashboardApi } from '../services/dashboardApi';
import { useFetch, useMutation } from '../hooks';
import { PlatformSettings } from '../types';
import { Button, Input } from '../components/UI';
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

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid ${theme.colors.gray200};

  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.label`
  font-weight: 600;
  color: ${theme.colors.coffeeDark};
  flex: 1;
`;

const SettingInput = styled(Input)`
  width: 150px;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Settings: React.FC = () => {
  const { data: settings } = useFetch<PlatformSettings>(
    () => dashboardApi.getPlatformSettings(),
    []
  );

  const updateMutation = useMutation((data) => dashboardApi.updatePlatformSettings(data));

  const [formData, setFormData] = useState<Partial<PlatformSettings>>(settings || {});

  const handleChange = (key: keyof PlatformSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    await updateMutation.mutate(formData);
  };

  return (
    <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Title>Platform Settings</Title>

      <Section>
        <SectionTitle>Commission Settings</SectionTitle>
        <FormGroup>
          <SettingRow>
            <SettingLabel>Platform Commission %</SettingLabel>
            <SettingInput
              type="number"
              value={formData.commissionPercentage || 0}
              onChange={(e) => handleChange('commissionPercentage', parseFloat(e.target.value))}
              placeholder="5"
            />
          </SettingRow>
        </FormGroup>
      </Section>

      <Section>
        <SectionTitle>Approval Rules</SectionTitle>
        <FormGroup>
          <SettingRow>
            <SettingLabel>Event Approval Required</SettingLabel>
            <Checkbox
              checked={formData.eventApprovalRequired || false}
              onChange={(e) => handleChange('eventApprovalRequired', e.target.checked)}
            />
          </SettingRow>
          <SettingRow>
            <SettingLabel>Auto Approve Events</SettingLabel>
            <Checkbox
              checked={formData.autoApproveEvents || false}
              onChange={(e) => handleChange('autoApproveEvents', e.target.checked)}
            />
          </SettingRow>
        </FormGroup>
      </Section>

      <Section>
        <SectionTitle>Verification Settings</SectionTitle>
        <FormGroup>
          <SettingRow>
            <SettingLabel>Bank Verification Required</SettingLabel>
            <Checkbox
              checked={formData.bankVerificationRequired || false}
              onChange={(e) => handleChange('bankVerificationRequired', e.target.checked)}
            />
          </SettingRow>
        </FormGroup>
      </Section>

      <Section>
        <SectionTitle>Notification Settings</SectionTitle>
        <FormGroup>
          <SettingRow>
            <SettingLabel>Email Notifications Enabled</SettingLabel>
            <Checkbox
              checked={formData.emailNotificationsEnabled || false}
              onChange={(e) => handleChange('emailNotificationsEnabled', e.target.checked)}
            />
          </SettingRow>
        </FormGroup>
      </Section>

      <Button variant="primary" onClick={handleSave} disabled={updateMutation.loading}>
        {updateMutation.loading ? 'Saving...' : 'Save Settings'}
      </Button>
      {updateMutation.success && <p style={{ color: theme.colors.success }}>Settings saved successfully!</p>}
    </Container>
  );
};

export default Settings;
