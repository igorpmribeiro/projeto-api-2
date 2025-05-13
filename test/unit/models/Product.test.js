import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Product } from '../../../src/models/Product.js';

describe('Product', () => {
  describe('constructor', () => {
    it('deve criar um objeto de produto com dados válidos', () => {
      // Dados válidos para produto
      const productData = {
        name: 'Produto Teste',
        price: 99.99,
        quantity: 50,
        description: 'Descrição do produto teste',
        codref: 'PROD001',
        images: ['imagem1.jpg', 'imagem2.jpg'],
        dimensions: { height: 10, width: 20, depth: 5 },
        categories: [1, 2]
      };
      
      // Criar novo produto
      const product = new Product(productData);
      
      // Verificar propriedades
      expect(product.name).toBe(productData.name);
      expect(product.price).toBe(productData.price);
      expect(product.quantity).toBe(productData.quantity);
      expect(product.description).toBe(productData.description);
      expect(product.codref).toBe(productData.codref);
      expect(product.images).toEqual(productData.images);
      expect(product.dimensions).toEqual(productData.dimensions);
      expect(product.categories).toEqual(productData.categories);
    });

    it('deve atribuir valores padrão para propriedades opcionais', () => {
      // Dados mínimos para produto
      const productData = {
        name: 'Produto Teste',
        price: 99.99
      };
      
      // Criar novo produto
      const product = new Product(productData);
      
      // Verificar propriedades com valores padrão
      expect(product.name).toBe(productData.name);
      expect(product.price).toBe(productData.price);
      expect(product.quantity).toBe(0); // valor padrão
      expect(product.description).toBe(''); // valor padrão
      expect(product.codref).toBe(''); // valor padrão
      expect(product.images).toEqual([]); // valor padrão
      expect(product.dimensions).toEqual({}); // valor padrão
      expect(product.categories).toEqual([]); // valor padrão
    });

    it('deve lidar com dados vazios ou nulos', () => {
      // Criar produto com dados vazios
      const product = new Product({});
      
      // Verificar propriedades com valores padrão
      expect(product.name).toBe('');
      expect(product.price).toBe(0);
      expect(product.quantity).toBe(0);
      expect(product.description).toBe('');
      expect(product.codref).toBe('');
      expect(product.images).toEqual([]);
      expect(product.dimensions).toEqual({});
      expect(product.categories).toEqual([]);
    });

    it('deve converter valores numéricos de string para número', () => {
      // Dados com strings numéricas
      const productData = {
        name: 'Produto Teste',
        price: '99.99',
        quantity: '50'
      };
      
      // Criar novo produto
      const product = new Product(productData);
      
      // Verificar propriedades convertidas
      expect(product.price).toBe(99.99);
      expect(product.quantity).toBe(50);
    });

    it('deve preservar o ID se fornecido', () => {
      // Dados com ID
      const productData = {
        id: 123,
        name: 'Produto Teste',
        price: 99.99
      };
      
      // Criar novo produto
      const product = new Product(productData);
      
      // Verificar ID
      expect(product.id).toBe(123);
    });
  });

  describe('toJSON', () => {
    it('deve retornar objeto JSON com todas as propriedades', () => {
      // Dados completos para produto
      const productData = {
        id: 1,
        name: 'Produto Teste',
        price: 99.99,
        quantity: 50,
        description: 'Descrição do produto teste',
        codref: 'PROD001',
        images: ['imagem1.jpg'],
        dimensions: { height: 10 },
        categories: [1]
      };
      
      // Criar novo produto
      const product = new Product(productData);
      
      // Obter representação JSON
      const json = product.toJSON();
      
      // Verificar propriedades
      expect(json).toEqual(productData);
    });

    it('deve omitir propriedades indefinidas', () => {
      // Dados parciais para produto
      const productData = {
        name: 'Produto Teste',
        price: 99.99
      };
      
      // Criar novo produto
      const product = new Product(productData);
      
      // Definir propriedade interna que não deve aparecer no JSON
      product._temporaryData = 'não deve aparecer';
      
      // Obter representação JSON
      const json = product.toJSON();
      
      // Verificar que propriedade interna não está presente
      expect(json).not.toHaveProperty('_temporaryData');
    });
  });
});
