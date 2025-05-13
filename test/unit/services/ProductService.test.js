import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { ProductService } from '../../../src/services/Products.js';
import { ProductRepository } from '../../../src/repositories/Products.js';
import { CacheService } from '../../../src/services/CacheService.js';
import { Product } from '../../../src/models/Product.js';

// Mock das dependências
jest.mock('../../../src/repositories/Products.js');
jest.mock('../../../src/services/CacheService.js');
jest.mock('../../../src/models/Product.js');

describe('ProductService', () => {
  let productService;
  let mockProduct;

  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();
    
    // Inicializar o serviço
    productService = new ProductService();
    
    // Dados de mock comuns
    mockProduct = {
      id: 1,
      name: 'Produto Teste',
      price: 99.99,
      quantity: 50,
      description: 'Descrição do produto teste',
      codref: 'PROD001'
    };
  });

  describe('create', () => {
    it('deve criar um produto com sucesso', async () => {
      // Configurar mock do repositório
      ProductRepository.prototype.create = jest.fn().mockResolvedValue(mockProduct);
      
      // Mock do construtor do modelo
      Product.mockImplementation((data) => data);
      
      // Executar método
      const result = await productService.create(mockProduct);
      
      // Verificar resultados
      expect(Product).toHaveBeenCalledWith(mockProduct);
      expect(ProductRepository.prototype.create).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });

    it('deve lançar erro quando dados do produto são inválidos', async () => {
      // Executar método e verificar erro
      await expect(productService.create(null)).rejects.toThrow('Erro ao criar produto: Produto inválido');
      
      // Verificar que o repositório não foi chamado
      expect(ProductRepository.prototype.create).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando o repositório falha', async () => {
      // Configurar repositório para lançar erro
      const repositoryError = new Error('Erro de banco de dados');
      ProductRepository.prototype.create = jest.fn().mockRejectedValue(repositoryError);
      
      // Mock do construtor do modelo
      Product.mockImplementation((data) => data);
      
      // Executar método e verificar erro
      await expect(productService.create(mockProduct)).rejects.toThrow(`Erro ao criar produto: ${repositoryError.message}`);
    });
  });

  describe('findById', () => {
    it('deve retornar um produto quando encontrado', async () => {
      // Configurar mock do repositório
      ProductRepository.prototype.findById = jest.fn().mockResolvedValue(mockProduct);
      
      // Executar método
      const result = await productService.findById(1);
      
      // Verificar resultados
      expect(ProductRepository.prototype.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });

    it('deve lançar erro quando ID não é fornecido', async () => {
      // Executar método e verificar erro
      await expect(productService.findById(null)).rejects.toThrow('Erro ao buscar produto: ID não fornecido');
      
      // Verificar que o repositório não foi chamado
      expect(ProductRepository.prototype.findById).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando o repositório falha', async () => {
      // Configurar repositório para lançar erro
      const repositoryError = new Error('Erro de banco de dados');
      ProductRepository.prototype.findById = jest.fn().mockRejectedValue(repositoryError);
      
      // Executar método e verificar erro
      await expect(productService.findById(1)).rejects.toThrow(`Erro ao buscar produto: ${repositoryError.message}`);
    });
  });

  describe('listAllProducts', () => {
    it('deve retornar produtos do cache quando disponíveis', async () => {
      // Configurar mock do cache para retornar dados
      const cachedProducts = [mockProduct];
      CacheService.prototype.get = jest.fn().mockResolvedValue(cachedProducts);
      
      // Executar método
      const result = await productService.listAllProducts();
      
      // Verificar resultados
      expect(CacheService.prototype.get).toHaveBeenCalledWith('allProducts');
      expect(ProductRepository.prototype.listAllProducts).not.toHaveBeenCalled();
      expect(result).toEqual(cachedProducts);
    });

    it('deve buscar produtos do repositório quando cache não disponível', async () => {
      // Configurar mock do cache vazio
      CacheService.prototype.get = jest.fn().mockResolvedValue(null);
      
      // Configurar mock do repositório
      const repositoryProducts = [mockProduct];
      ProductRepository.prototype.listAllProducts = jest.fn().mockResolvedValue(repositoryProducts);
      
      // Executar método
      const result = await productService.listAllProducts();
      
      // Verificar resultados
      expect(CacheService.prototype.get).toHaveBeenCalledWith('allProducts');
      expect(ProductRepository.prototype.listAllProducts).toHaveBeenCalled();
      expect(CacheService.prototype.set).toHaveBeenCalledWith('allProducts', repositoryProducts);
      expect(result).toEqual(repositoryProducts);
    });

    it('deve lançar erro quando o repositório falha', async () => {
      // Configurar mock do cache vazio
      CacheService.prototype.get = jest.fn().mockResolvedValue(null);
      
      // Configurar repositório para lançar erro
      const repositoryError = new Error('Erro de banco de dados');
      ProductRepository.prototype.listAllProducts = jest.fn().mockRejectedValue(repositoryError);
      
      // Executar método e verificar erro
      await expect(productService.listAllProducts()).rejects.toThrow(`Erro ao listar produtos: ${repositoryError.message}`);
    });
  });

  describe('updateProduct', () => {
    it('deve atualizar um produto com sucesso', async () => {
      // Dados de atualização
      const updateData = { name: 'Produto Atualizado' };
      const updatedProduct = { ...mockProduct, ...updateData };
      
      // Configurar mock do repositório
      ProductRepository.prototype.updateProduct = jest.fn().mockResolvedValue(updatedProduct);
      
      // Executar método
      const result = await productService.updateProduct(1, updateData);
      
      // Verificar resultados
      expect(ProductRepository.prototype.updateProduct).toHaveBeenCalledWith(1, updateData);
      expect(result).toEqual(updatedProduct);
    });

    it('deve lançar erro quando ID ou dados do produto não são fornecidos', async () => {
      // Executar método sem ID e verificar erro
      await expect(productService.updateProduct(null, { name: 'Test' })).rejects.toThrow(
        'Erro ao atualizar produto: ID ou dados do produto não fornecidos'
      );
      
      // Executar método sem dados e verificar erro
      await expect(productService.updateProduct(1, null)).rejects.toThrow(
        'Erro ao atualizar produto: ID ou dados do produto não fornecidos'
      );
      
      // Verificar que o repositório não foi chamado
      expect(ProductRepository.prototype.updateProduct).not.toHaveBeenCalled();
    });
  });

  describe('checkProductStock', () => {
    it('deve retornar o estoque do produto', async () => {
      // Configurar mock do repositório
      const stockValue = 50;
      ProductRepository.prototype.checkProductStock = jest.fn().mockResolvedValue(stockValue);
      
      // Executar método
      const result = await productService.checkProductStock(1);
      
      // Verificar resultados
      expect(ProductRepository.prototype.checkProductStock).toHaveBeenCalledWith(1);
      expect(result).toEqual(stockValue);
    });

    it('deve lançar erro quando ID não é fornecido', async () => {
      // Executar método sem ID e verificar erro
      await expect(productService.checkProductStock(null)).rejects.toThrow('Erro ao verificar estoque: ID não fornecido');
      
      // Verificar que o repositório não foi chamado
      expect(ProductRepository.prototype.checkProductStock).not.toHaveBeenCalled();
    });
  });

  describe('getProductAttributes', () => {
    it('deve retornar atributos do cache quando disponíveis', async () => {
      // Configurar mock do cache para retornar dados
      const cachedAttributes = [{ id: 1, name: 'Cor', value: 'Azul' }];
      CacheService.prototype.get = jest.fn().mockResolvedValue(cachedAttributes);
      
      // Executar método
      const result = await productService.getProductAttributes(1);
      
      // Verificar resultados
      expect(CacheService.prototype.get).toHaveBeenCalledWith('productAttributes:1');
      expect(ProductRepository.prototype.getProductAttributes).not.toHaveBeenCalled();
      expect(result).toEqual(cachedAttributes);
    });

    it('deve buscar atributos do repositório quando cache não disponível', async () => {
      // Configurar mock do cache vazio
      CacheService.prototype.get = jest.fn().mockResolvedValue(null);
      
      // Configurar mock do repositório
      const repositoryAttributes = [{ id: 1, name: 'Cor', value: 'Azul' }];
      ProductRepository.prototype.getProductAttributes = jest.fn().mockResolvedValue(repositoryAttributes);
      
      // Executar método
      const result = await productService.getProductAttributes(1);
      
      // Verificar resultados
      expect(CacheService.prototype.get).toHaveBeenCalledWith('productAttributes:1');
      expect(ProductRepository.prototype.getProductAttributes).toHaveBeenCalledWith(1);
      expect(result).toEqual(repositoryAttributes);
    });

    it('deve lançar erro quando ID não é fornecido', async () => {
      // Executar método sem ID e verificar erro
      await expect(productService.getProductAttributes(null)).rejects.toThrow('Erro ao buscar atributos do produto: ID não fornecido');
      
      // Verificar que o repositório não foi chamado
      expect(ProductRepository.prototype.getProductAttributes).not.toHaveBeenCalled();
    });
  });

  describe('insertAttribute', () => {
    it('deve inserir um atributo com sucesso', async () => {
      // Dados do atributo
      const attribute = { name: 'Cor', value: 'Azul' };
      const savedAttribute = { id: 1, ...attribute };
      
      // Configurar mock do repositório
      ProductRepository.prototype.insertAttribute = jest.fn().mockResolvedValue(savedAttribute);
      
      // Executar método
      const result = await productService.insertAttribute(1, attribute);
      
      // Verificar resultados
      expect(ProductRepository.prototype.insertAttribute).toHaveBeenCalledWith(1, attribute);
      expect(result).toEqual(savedAttribute);
    });

    it('deve lançar erro quando ID ou atributo não são fornecidos', async () => {
      // Executar método sem ID e verificar erro
      await expect(productService.insertAttribute(null, { name: 'Cor' })).rejects.toThrow(
        'Erro ao inserir atributo: Produto não encontrado'
      );
      
      // Executar método sem atributo e verificar erro
      await expect(productService.insertAttribute(1, null)).rejects.toThrow(
        'Erro ao inserir atributo: Produto não encontrado'
      );
      
      // Verificar que o repositório não foi chamado
      expect(ProductRepository.prototype.insertAttribute).not.toHaveBeenCalled();
    });
  });
});
