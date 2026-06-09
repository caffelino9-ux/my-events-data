// Admin Login Page
import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/UI';
import { motion } from 'framer-motion';

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  flex: 1;
  background: linear-gradient(135deg, ${theme.colors.coffeeDark} 0%, ${theme.colors.coffeeMedium} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const Card = styled(motion.div)`
  background: ${theme.colors.white};
  border-radius: 16px;
  padding: 48px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 32px;

  h1 {
    margin: 0;
    font-size: 28px;
    color: ${theme.colors.gold};
    font-weight: 700;
  }

  p {
    margin: 8px 0 0 0;
    color: #757575;
    font-size: 14px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: ${theme.colors.coffeeDark};
  font-size: 14px;
`;

const Error = styled.p`
  color: ${theme.colors.error};
  font-size: 12px;
  margin: 0;
`;

const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: 8px;
`;

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (error) {
      const err = error as any;
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Logo>
          <h1>Caffelino</h1>
          <p>Admin Dashboard</p>
        </Logo>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@caffelino.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>

          {error && <Error>{error}</Error>}

          <SubmitButton
            variant="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </SubmitButton>
        </Form>
      </Card>
    </Container>
  );
};

export default AdminLogin;
