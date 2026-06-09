import { css } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = css`
  /* Reset */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background-color: ${theme.colors.cream};
    color: ${theme.colors.coffeeDark};
    font-family: ${theme.typography.fontFamily};
    font-size: 16px;
    font-weight: 400;
    line-height: ${theme.typography.lineHeights.normal};
    overflow-x: hidden;
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.cream};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.coffeeMedium};
    border-radius: 9999px;

    &:hover {
      background: ${theme.colors.coffeeDark};
    }
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: ${theme.typography.lineHeights.tight};
    color: ${theme.colors.coffeeDark};
  }

  h1 {
    font-size: 48px;
  }

  h2 {
    font-size: 36px;
  }

  h3 {
    font-size: 30px;
  }

  h4 {
    font-size: 24px;
  }

  h5 {
    font-size: 20px;
  }

  h6 {
    font-size: 18px;
  }

  p {
    font-size: 16px;
    line-height: ${theme.typography.lineHeights.normal};
  }

  small {
    font-size: 14px;
  }

  /* Links */
  a {
    color: ${theme.colors.gold};
    text-decoration: none;
    transition: color ${theme.transitions.fast};

    &:hover {
      color: ${theme.colors.goldDark};
    }
  }

  /* Buttons Reset */
  button {
    font-family: ${theme.typography.fontFamily};
    cursor: pointer;
    border: none;
    background: none;
  }

  /* Input Reset */
  input, textarea, select {
    font-family: ${theme.typography.fontFamily};
    color: ${theme.colors.coffeeDark};

    &::placeholder {
      color: ${theme.colors.gray500};
    }
  }

  /* Selection */
  ::selection {
    background-color: ${theme.colors.gold};
    color: ${theme.colors.white};
  }

  /* Utility Classes */
  .hidden {
    display: none !important;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Animation Keyframes */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideInFromLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInFromRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInFromTop {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInFromBottom {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
`;
