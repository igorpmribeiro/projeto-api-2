// Configurações globais para testes
import { jest } from '@jest/globals';

// Define timeout global para testes
jest.setTimeout(10000);

// Silencia logs durante os testes (opcional)
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};
