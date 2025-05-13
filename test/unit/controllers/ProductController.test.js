import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { ProductController } from '../../../src/controllers/Products.js';
import { ProductService } from '../../../src/services/Products.js';
import { ProductValidator } from '../../../src/validators/Products.js';

// Mock das dependências
jest.mock('../../../src/services/Products.js');
jest.mock('../../../src/validators/Products.js');

describe('ProductController', () => {
  let productController;
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();
    
    // Inicializar o controlador
    productController = new ProductController();
    
    // Configurar mocks para request, response e next
    mockReq = {
      body: {},
      params: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    mockNext = jest.fn();
  });

  describe('create', () => {
    it('deve criar um produto com sucesso quando dados são válidos', async () => {
      // Configurar mock do validador
      ProductValidator.prototype.validate = jest.fn().mockReturnValue({ isValid: true });
      
      // Configurar mock do serviço
      const mockCreatedProduct = { id: 1, name: 'Produto Teste' };
      ProductService.prototype.create = jest.fn().mockResolvedValue(mockCreatedProduct);
      
      // Configurar request
      mockReq.body = { name: 'Produto Teste', price: 99.99 };
      
      // Executar método
      await productController.create(mockReq, mockRes, mockNext);
      
      // Verificar resultados
      expect(ProductValidator.prototype.validate).toHaveBeenCalledWith(mockReq.body);
      expect(ProductService.prototype.create).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Produto criado com sucesso',
        ProductID: mockCreatedProduct.id,
        Name: mockCreatedProduct.name
      });
    });

    it('deve retornar erro 400 quando validação falha', async () => {
      // Configurar mock do validador com falha
      const mockErrors = ['Nome é obrigatório'];
      ProductValidator.prototype.validate = jest.fn().mockReturnValue({
        isValid: false,
        errors: mockErrors
      });
      
      // Executar método
      await productController.create(mockReq, mockRes, mockNext);
      
      // Verificar resultados
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ errors: mockErrors });
      expect(ProductService.prototype.create).not.toHaveBeenCalled();
    });

    it('deve chamar next com erro em caso de exceção', async () => {
      // Configurar validador para sucesso, mas serviço para falha
      ProductValidator.prototype.validate = jest.fn().mockReturnValue({ isValid: true });
      
      const testError = new Error('Erro ao criar produto');
      ProductService.prototype.create = jest.fn().mockRejectedValue(testError);
      
      // Executar método
      await productController.create(mockReq, mockRes, mockNext);
      
      // Verificar resultados
      expect(mockNext).toHaveBeenCalledWith(testError);
    });
  });

  describe('findById', () => {
    it('deve retornar um produto quando encontrado', async () => {
      // Configurar mock do serviço
      const mockProduct = { id: 1, name: 'Produto Teste', price: 99.99 };
      ProductService.prototype.findById = jest.fn().mockResolvedValue(mockProduct);
      
      // Configurar request
      mockReq.params = { id: '1' };
      
      // Executar método
      await productController.findById(mockReq, mockRes, mockNext);
      
      // Verificar resultados
      expect(ProductService.prototype.findById).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith(mockProduct);
    });

    it('deve retornar 404 quando produto não é encontrado', async () => {
      // Configurar serviço para retornar null (produto não encontrado)
      ProductService.prototype.findById = jest.fn().mockResolvedValue(null);
      
      // Configurar request
      mockReq.params = { id: '999' };
      
      // Executar método
      await productController.findById(mockReq, mockRes, mockNext);
      
      // Verificar resultados
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    it('deve chamar next com erro em caso de exceção', async () => {
      // Configurar serviço para lançar erro
      const testError = new Error('Erro ao buscar produto');
      ProductService.prototype.findById = jest.fn().mockRejectedValue(testError);
      
      // Configurar request
      mockReq.params = { id: '1' };
      
      // Executar método
      await productController.findById(mockReq, mockRes, mockNext);
      
      // Verificar resultados
      expect(mockNext).toHaveBeenCalledWith(testError);
    });
  });

  describe('listAllProducts', () => {
    it('deve listar todos os produtos com sucesso', async () => {
      // Configurar mock do serviço
      const mockProducts = [
        { id: 1, name: 'Produto 1', price: 99.99 },
        { id: 2, name: 'Produto 2', price: 149.99 }
      ];
      ProductService.prototype.listAllProducts = jest.fn().mockResolvedValue(mockProducts);
      
      // Executar método
      await productController.listAllProducts(mockReq, mockRes);
      
      // Verificar resultados
      expect(ProductService.prototype.listAllProducts).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockProducts);
    });

    it('deve retornar erro 500 quando ocorre exceção', async () => {
      // Configurar serviço para lançar erro
      const testError = new Error('Erro ao listar produtos');
      ProductService.prototype.listAllProducts = jest.fn().mockRejectedValue(testError);
      
      // Executar método
      await productController.listAllProducts(mockReq, mockRes);
      
      // Verificar resultados
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: testError.message });
    });
  });

  describe('updateProduct', () => {
    it('deve atualizar um produto com sucesso quando dados são válidos', async () => {
      // Configurar mock do validador
      ProductValidator.prototype.validateUpdate = jest.fn().mockReturnValue({ isValid: true });
      
      // Configurar mock do serviço
      ProductService.prototype.updateProduct = jest.fn().mockResolvedValue({});
      
      // Configurar request
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Produto Atualizado' };
      
      // Executar método
      await productController.updateProduct(mockReq, mockRes, mockNext);
      
      // Verificar resultados
      expect(ProductValidator.prototype.validateUpdate).toHaveBeenCalledWith(mockReq.body);
      expect(ProductService.prototype.updateProduct).toHaveBeenCalledWith('1', mockReq.body);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Product updated' });
    });

    it('deve retornar erro 400 quando validação falha', async () => {
      // Configurar mock do validador com falha
      const mockErrors = ['Dados inválidos'];
      ProductValidator.prototype.validateUpdate = jest.fn().mockReturnValue({
        isValid: false,
        errors: mockErrors
      });
      
      // Executar método
      await productController.updateProduct(mockReq, mockRes, mockNext);
      
      // Verificar resultados
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ errors: mockErrors });
      expect(ProductService.prototype.updateProduct).not.toHaveBeenCalled();
    });
  });

  describe('checkProductPrice', () => {
    it('deve retornar o preço do produto quando encontrado', async () => {
      // Configurar mock do serviço
      const mockProduct = { id: 1, name: 'Produto Teste', price: 99.99 };
      ProductService.prototype.findById = jest.fn().mockResolvedValue(mockProduct);
      
      // Configurar request
      mockReq.params = { id: '1' };
      
      // Executar método
      await productController.checkProductPrice(mockReq, mockRes, mockNext);
      
      // Verificar resultados
      expect(ProductService.prototype.findById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ id: '1', price: mockProduct.price });
    });

    it('deve retornar 404 quando produto não é encontrado', async () => {
      // Configurar serviço para retornar null (produto não encontrado)
      ProductService.prototype.findById = jest.fn().mockResolvedValue(null);
      
      // Configurar request
      mockReq.params = { id: '999' };
      
      // Executar método
      await productController.checkProductPrice(mockReq, mockRes, mockNext);
      
      // Verificar resultados
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });
  });
  
  describe('checkProductStock', () => {
    it('deve retornar o estoque do produto quando encontrado', async () => {
      // Configurar mock do serviço
      const stockValue = 50;
      ProductService.prototype.checkProductStock = jest.fn().mockResolvedValue(stockValue);
      
      // Configurar request
      mockReq.params = { id: '1' };
      
      // Executar método
      await productController.checkProductStock(mockReq, mockRes, mockNext);
      
      // Verificar resultados
      expect(ProductService.prototype.checkProductStock).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ id: '1', stock: stockValue });
    });

    it('deve chamar next com erro em caso de exceção', async () => {
      // Configurar serviço para lançar erro
      const testError = new Error('Erro ao verificar estoque');
      ProductService.prototype.checkProductStock = jest.fn().mockRejectedValue(testError);
      
      // Configurar request
      mockReq.params = { id: '1' };
      
      // Executar método
      await productController.checkProductStock(mockReq, mockRes, mockNext);
      
      // Verificar resultados
      expect(mockNext).toHaveBeenCalledWith(testError);
    });
  });

  describe('getProductAttributes', () => {
    it('deve retornar os atributos do produto quando encontrados', async () => {
      // Configurar mock do serviço
      const mockAttributes = [
        { id: 1, name: 'Cor', value: 'Azul' },
        { id: 2, name: 'Tamanho', value: 'M' }
      ];
      ProductService.prototype.getProductAttributes = jest.fn().mockResolvedValue(mockAttributes);
      
      // Configurar request
      mockReq.params = { id: '1' };
      
      // Executar método
      await productController.getProductAttributes(mockReq, mockRes, mockNext);
      
      // Verificar resultados
      expect(ProductService.prototype.getProductAttributes).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        status: 200, 
        totalCount: mockAttributes.length, 
        result: mockAttributes 
      });
    });

    it('deve retornar 404 quando nenhum atributo é encontrado', async () => {
      // Configurar serviço para retornar array vazio
      ProductService.prototype.getProductAttributes = jest.fn().mockResolvedValue([]);
      
      // Configurar request
      mockReq.params = { id: '1' };
      
      // Executar método
      await productController.getProductAttributes(mockReq, mockRes, mockNext);
      
      // Verificar resultados
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        status: 404, 
        message: 'No attributes found for this product' 
      });
    });
  });
});
