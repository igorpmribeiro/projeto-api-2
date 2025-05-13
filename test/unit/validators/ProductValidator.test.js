import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { ProductValidator } from '../../../src/validators/Products.js';

describe('ProductValidator', () => {
  let productValidator;

  beforeEach(() => {
    // Inicializar o validador
    productValidator = new ProductValidator();
  });

  describe('validate', () => {
    it('deve validar um produto válido com sucesso', () => {
      // Dados válidos para produto
      const validProduct = {
        name: 'Produto Teste',
        price: 99.99,
        quantity: 50,
        description: 'Descrição do produto teste',
        codref: 'PROD001'
      };
      
      // Executar validação
      const result = productValidator.validate(validProduct);
      
      // Verificar resultado
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('deve falhar quando nome não é fornecido', () => {
      // Produto sem nome
      const invalidProduct = {
        price: 99.99,
        quantity: 50,
        description: 'Descrição do produto teste',
        codref: 'PROD001'
      };
      
      // Executar validação
      const result = productValidator.validate(invalidProduct);
      
      // Verificar resultado
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome do produto é obrigatório');
    });

    it('deve falhar quando preço não é fornecido', () => {
      // Produto sem preço
      const invalidProduct = {
        name: 'Produto Teste',
        quantity: 50,
        description: 'Descrição do produto teste',
        codref: 'PROD001'
      };
      
      // Executar validação
      const result = productValidator.validate(invalidProduct);
      
      // Verificar resultado
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Preço do produto é obrigatório');
    });

    it('deve falhar quando preço é negativo', () => {
      // Produto com preço negativo
      const invalidProduct = {
        name: 'Produto Teste',
        price: -10,
        quantity: 50,
        description: 'Descrição do produto teste',
        codref: 'PROD001'
      };
      
      // Executar validação
      const result = productValidator.validate(invalidProduct);
      
      // Verificar resultado
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Preço deve ser maior que zero');
    });

    it('deve falhar quando quantidade é negativa', () => {
      // Produto com quantidade negativa
      const invalidProduct = {
        name: 'Produto Teste',
        price: 99.99,
        quantity: -5,
        description: 'Descrição do produto teste',
        codref: 'PROD001'
      };
      
      // Executar validação
      const result = productValidator.validate(invalidProduct);
      
      // Verificar resultado
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Quantidade deve ser um número não negativo');
    });

    it('deve retornar múltiplos erros quando várias validações falham', () => {
      // Produto com múltiplos problemas
      const invalidProduct = {
        description: 'Apenas descrição'
      };
      
      // Executar validação
      const result = productValidator.validate(invalidProduct);
      
      // Verificar resultado
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
      expect(result.errors).toContain('Nome do produto é obrigatório');
      expect(result.errors).toContain('Preço do produto é obrigatório');
    });
  });

  describe('validateUpdate', () => {
    it('deve validar uma atualização válida com sucesso', () => {
      // Dados válidos para atualização
      const validUpdate = {
        name: 'Nome Atualizado',
        price: 109.99
      };
      
      // Executar validação
      const result = productValidator.validateUpdate(validUpdate);
      
      // Verificar resultado
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('deve falhar quando preço é negativo na atualização', () => {
      // Atualização com preço negativo
      const invalidUpdate = {
        price: -10
      };
      
      // Executar validação
      const result = productValidator.validateUpdate(invalidUpdate);
      
      // Verificar resultado
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Preço deve ser maior que zero');
    });

    it('deve falhar quando quantidade é negativa na atualização', () => {
      // Atualização com quantidade negativa
      const invalidUpdate = {
        quantity: -5
      };
      
      // Executar validação
      const result = productValidator.validateUpdate(invalidUpdate);
      
      // Verificar resultado
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Quantidade deve ser um número não negativo');
    });

    it('deve aceitar atualizações parciais', () => {
      // Atualização apenas de um campo
      const partialUpdate = {
        description: 'Nova descrição do produto'
      };
      
      // Executar validação
      const result = productValidator.validateUpdate(partialUpdate);
      
      // Verificar resultado
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
