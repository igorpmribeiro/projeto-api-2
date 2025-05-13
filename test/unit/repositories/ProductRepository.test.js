import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { ProductRepository } from '../../../src/repositories/Products.js';
import { db } from '../../../src/config/knexfile.js';

// Mock da dependência do banco de dados
jest.mock('../../../src/config/knexfile.js', () => ({
  db: {
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    whereIn: jest.fn().mockReturnThis(),
    first: jest.fn(),
    join: jest.fn().mockReturnThis(),
    update: jest.fn()
  }
}));

describe('ProductRepository', () => {
  let productRepository;
  let mockProduct;

  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();
    
    // Inicializar o repositório
    productRepository = new ProductRepository();
    
    // Dados de mock comuns
    mockProduct = {
      id: 1,
      name: 'Produto Teste',
      price: 99.99,
      quantity: 50,
      description: 'Descrição do produto teste',
      codref: 'PROD001',
      images: ['imagem1.jpg', 'imagem2.jpg'],
      dimensions: { height: 10, width: 20, depth: 5 },
      categories: [1, 2]
    };
  });

  describe('create', () => {
    it('deve criar um produto com sucesso', async () => {
      // Configurar mock do banco de dados
      db.insert.mockResolvedValueOnce([1]); // Retornar ID do produto
      
      // Executar método
      const result = await productRepository.create(mockProduct);
      
      // Verificar chamadas ao banco de dados
      expect(db.insert).toHaveBeenCalledWith(expect.objectContaining({
        name: mockProduct.name,
        price: mockProduct.price,
        images: JSON.stringify(mockProduct.images),
        dimensions: JSON.stringify(mockProduct.dimensions)
      }));
      
      // Verificar resultado
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('name', mockProduct.name);
    });

    it('deve inserir categorias quando fornecidas', async () => {
      // Configurar mock do banco de dados
      db.insert.mockResolvedValueOnce([1]); // Primeira chamada (produto)
      db.insert.mockResolvedValueOnce([]); // Segunda chamada (categorias)
      
      // Executar método
      await productRepository.create(mockProduct);
      
      // Verificar chamadas ao banco de dados para inserir categorias
      expect(db.insert).toHaveBeenCalledTimes(2);
      
      // Verificar que a segunda chamada insere as categorias
      const secondCallArg = db.insert.mock.calls[1][0];
      expect(secondCallArg).toHaveLength(mockProduct.categories.length);
      expect(secondCallArg[0]).toHaveProperty('products_id', 1);
      expect(secondCallArg[0]).toHaveProperty('categories_id', mockProduct.categories[0]);
    });

    it('deve inserir atributos quando fornecidos', async () => {
      // Configurar produto com atributos
      const productWithAttributes = {
        ...mockProduct,
        attributes: [
          { 
            isDefault: 1, 
            priceDiff: 'add', 
            weightDiff: 'add', 
            stock: 10, 
            price: 109.99,
            weight: 1,
            optionsIds: [1, 2]
          }
        ],
        attrGroupId: 5
      };
      
      // Configurar mock do banco de dados
      db.insert.mockResolvedValueOnce([1]); // Primeira chamada (produto)
      db.insert.mockResolvedValueOnce([]); // Segunda chamada (categorias)
      db.insert.mockResolvedValueOnce([]); // Terceira chamada (atributos)
      
      // Executar método
      await productRepository.create(productWithAttributes);
      
      // Verificar chamadas ao banco de dados para inserir atributos
      expect(db.insert).toHaveBeenCalledTimes(3);
      
      // Verificar que a terceira chamada insere os atributos
      const thirdCallArg = db.insert.mock.calls[2][0];
      expect(thirdCallArg).toHaveLength(1);
      expect(thirdCallArg[0]).toHaveProperty('products_id', 1);
      expect(thirdCallArg[0]).toHaveProperty('products_options_id', 5);
      expect(thirdCallArg[0]).toHaveProperty('paestoque', 10);
    });

    it('deve lançar erro quando falha ao inserir produto', async () => {
      // Configurar mock do banco de dados para lançar erro
      const dbError = new Error('Erro de banco de dados');
      db.insert.mockRejectedValueOnce(dbError);
      
      // Executar método e verificar erro
      await expect(productRepository.create(mockProduct)).rejects.toThrow(`Error creating product: ${dbError.message}`);
    });
  });

  describe('findById', () => {
    it('deve retornar um produto quando encontrado', async () => {
      // Configurar mock do banco de dados
      const mockDbProduct = {
        ...mockProduct,
        dimensions: JSON.stringify(mockProduct.dimensions),
        images: JSON.stringify(mockProduct.images)
      };
      db.first.mockResolvedValueOnce(mockDbProduct);
      
      // Mock para busca de categorias
      const mockCategories = [
        { id: 1, name: 'Categoria 1', parent_id: 0 },
        { id: 2, name: 'Categoria 2', parent_id: 1 }
      ];
      db.select.mockReturnValueOnce(mockCategories);
      
      // Executar método
      const result = await productRepository.findById(1);
      
      // Verificar chamadas ao banco de dados
      expect(db.where).toHaveBeenCalledWith({ id: 1 });
      expect(db.first).toHaveBeenCalled();
      
      // Verificar resultado
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('name', mockProduct.name);
      expect(result.dimensions).toEqual(mockProduct.dimensions);
      expect(result.images).toEqual(mockProduct.images);
      expect(result.categories).toHaveLength(2);
    });

    it('deve retornar null quando produto não é encontrado', async () => {
      // Configurar mock do banco de dados para retornar null
      db.first.mockResolvedValueOnce(null);
      
      // Executar método
      const result = await productRepository.findById(999);
      
      // Verificar chamadas ao banco de dados
      expect(db.where).toHaveBeenCalledWith({ id: 999 });
      expect(db.first).toHaveBeenCalled();
      
      // Verificar resultado
      expect(result).toBeNull();
    });
  });

  describe('listAllProducts', () => {
    it('deve listar todos os produtos', async () => {
      // Configurar mock do banco de dados
      const mockDbProducts = [
        {
          ...mockProduct,
          dimensions: JSON.stringify(mockProduct.dimensions),
          images: JSON.stringify(mockProduct.images),
          categories: JSON.stringify(mockProduct.categories)
        },
        {
          id: 2,
          name: 'Produto 2',
          price: 149.99,
          quantity: 25,
          description: 'Outro produto',
          codref: 'PROD002',
          dimensions: '[]',
          images: '[]',
          categories: '[]'
        }
      ];
      db.select.mockReturnValueOnce(mockDbProducts);
      
      // Executar método
      const result = await productRepository.listAllProducts();
      
      // Verificar chamadas ao banco de dados
      expect(db.select).toHaveBeenCalledWith('*');
      
      // Verificar resultado
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id', 1);
      expect(result[0]).toHaveProperty('name', mockProduct.name);
      expect(result[0].dimensions).toEqual(mockProduct.dimensions);
      expect(result[0].images).toEqual(mockProduct.images);
      expect(result[0].categories).toEqual(mockProduct.categories);
      
      expect(result[1]).toHaveProperty('id', 2);
      expect(result[1]).toHaveProperty('name', 'Produto 2');
      expect(result[1].dimensions).toEqual([]);
      expect(result[1].images).toEqual([]);
      expect(result[1].categories).toEqual([]);
    });
  });

  describe('updateProduct', () => {
    it('deve atualizar um produto com sucesso', async () => {
      // Configurar mock do repositório findById
      const mockFindById = jest.spyOn(productRepository, 'findById');
      mockFindById.mockResolvedValueOnce(mockProduct);
      
      // Dados de atualização
      const updateData = { name: 'Nome Atualizado', price: 109.99 };
      
      // Executar método
      const result = await productRepository.updateProduct(1, updateData);
      
      // Verificar chamadas ao banco de dados
      expect(mockFindById).toHaveBeenCalledWith(1);
      expect(db.where).toHaveBeenCalledWith({ id: 1 });
      expect(db.update).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Nome Atualizado',
        price: 109.99,
        categories: JSON.stringify(mockProduct.categories)
      }));
      
      // Verificar resultado
      expect(result).toHaveProperty('name', 'Nome Atualizado');
      expect(result).toHaveProperty('price', 109.99);
      expect(result).toHaveProperty('quantity', mockProduct.quantity);
    });

    it('deve lançar erro quando produto não é encontrado', async () => {
      // Configurar mock do repositório findById para retornar null
      const mockFindById = jest.spyOn(productRepository, 'findById');
      mockFindById.mockResolvedValueOnce(null);
      
      // Dados de atualização
      const updateData = { name: 'Nome Atualizado' };
      
      // Executar método e verificar erro
      await expect(productRepository.updateProduct(999, updateData)).rejects.toThrow('Product not found');
      
      // Verificar que update não foi chamado
      expect(db.update).not.toHaveBeenCalled();
    });
  });

  describe('checkProductStock', () => {
    it('deve retornar o estoque do produto quando encontrado', async () => {
      // Configurar mock do repositório findById
      const mockFindById = jest.spyOn(productRepository, 'findById');
      mockFindById.mockResolvedValueOnce(mockProduct);
      
      // Executar método
      const result = await productRepository.checkProductStock(1);
      
      // Verificar chamadas
      expect(mockFindById).toHaveBeenCalledWith(1);
      
      // Verificar resultado
      expect(result).toBe(mockProduct.quantity);
    });

    it('deve retornar mensagem de erro quando produto não é encontrado', async () => {
      // Configurar mock do repositório findById para retornar null
      const mockFindById = jest.spyOn(productRepository, 'findById');
      mockFindById.mockResolvedValueOnce(null);
      
      // Executar método
      const result = await productRepository.checkProductStock(999);
      
      // Verificar chamadas
      expect(mockFindById).toHaveBeenCalledWith(999);
      
      // Verificar resultado
      expect(result).toBe('Produto não encontrado, verifique o ID do produto');
    });
  });

  describe('checkProductPrice', () => {
    it('deve retornar o preço do produto quando encontrado', async () => {
      // Configurar mock do repositório findById
      const mockFindById = jest.spyOn(productRepository, 'findById');
      mockFindById.mockResolvedValueOnce(mockProduct);
      
      // Executar método
      const result = await productRepository.checkProductPrice(1);
      
      // Verificar chamadas
      expect(mockFindById).toHaveBeenCalledWith(1);
      
      // Verificar resultado
      expect(result).toBe(mockProduct.price);
    });

    it('deve retornar mensagem de erro quando produto não é encontrado', async () => {
      // Configurar mock do repositório findById para retornar null
      const mockFindById = jest.spyOn(productRepository, 'findById');
      mockFindById.mockResolvedValueOnce(null);
      
      // Executar método
      const result = await productRepository.checkProductPrice(999);
      
      // Verificar chamadas
      expect(mockFindById).toHaveBeenCalledWith(999);
      
      // Verificar resultado
      expect(result).toBe('Produto não encontrado, verifique o ID do produto');
    });
  });

  describe('insertAttribute', () => {
    it('deve inserir um atributo com sucesso', async () => {
      // Configurar mock do repositório findById
      const mockFindById = jest.spyOn(productRepository, 'findById');
      mockFindById.mockResolvedValueOnce({
        ...mockProduct,
        attrGroupId: 5
      });
      
      // Dados do atributo
      const attributeData = {
        optionsIds: [1, 2],
        price: 10.5,
        stock: 20
      };
      
      // Configurar mock do banco de dados
      db.insert.mockResolvedValueOnce([1]); // ID do atributo inserido
      
      // Executar método
      const result = await productRepository.insertAttribute(1, attributeData);
      
      // Verificar chamadas ao banco de dados
      expect(mockFindById).toHaveBeenCalledWith(1);
      expect(db.insert).toHaveBeenCalledWith(expect.objectContaining({
        products_id: 1,
        products_options_id: 5,
        paestoque: 20,
        papreco: 10.5,
        paoptionsids: JSON.stringify([1, 2])
      }));
      
      // Verificar resultado
      expect(result).toHaveProperty('products_id', 1);
      expect(result).toHaveProperty('products_options_id', 5);
    });

    it('deve lançar erro quando produto não é encontrado', async () => {
      // Configurar mock do repositório findById para retornar null
      const mockFindById = jest.spyOn(productRepository, 'findById');
      mockFindById.mockResolvedValueOnce(null);
      
      // Dados do atributo
      const attributeData = { optionsIds: [1, 2] };
      
      // Executar método e verificar erro
      await expect(productRepository.insertAttribute(999, attributeData)).rejects.toThrow('Product not found');
      
      // Verificar que insert não foi chamado
      expect(db.insert).not.toHaveBeenCalled();
    });
  });

  describe('getProductAttributes', () => {
    it('deve retornar os atributos formatados do produto', async () => {
      // Configurar mock dos atributos do produto
      const mockAttributes = [
        {
          paid: 1,
          pacodref: 'ATTR001',
          paimagem: '"imagem1.jpg"',
          paoptionsids: '[1, 2]',
          paestoque: 20,
          padefault: 1,
          padimensions: '[{"height": 10, "width": 20}]'
        },
        {
          paid: 2,
          pacodref: 'ATTR002',
          paimagem: 'null',
          paoptionsids: '[]',
          paestoque: 10,
          padefault: 0,
          padimensions: 'null'
        }
      ];
      db.select.mockReturnValueOnce(mockAttributes);
      
      // Mock para busca de opções de atributos
      const mockOptions = [
        { id: 1, name: 'Cor', value: 'Azul' },
        { id: 2, name: 'Tamanho', value: 'M' }
      ];
      db.select.mockReturnValueOnce(mockOptions);
      
      // Executar método
      const result = await productRepository.getProductAttributes(1);
      
      // Verificar chamadas ao banco de dados
      expect(db.where).toHaveBeenCalledWith('products_id', 1);
      
      // Verificar resultado
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id', 1);
      expect(result[0]).toHaveProperty('codref', 'ATTR001');
      expect(result[0]).toHaveProperty('quantity', 20);
      expect(result[0]).toHaveProperty('isDefault', true);
      expect(result[0].poids).toHaveLength(2);
      expect(result[0].dimensions).toEqual([{"height": 10, "width": 20}]);
      
      expect(result[1]).toHaveProperty('id', 2);
      expect(result[1]).toHaveProperty('codref', 'ATTR002');
      expect(result[1]).toHaveProperty('quantity', 10);
      expect(result[1]).toHaveProperty('isDefault', false);
      expect(result[1].poids).toHaveLength(0);
      expect(result[1].dimensions).toBe(false);
    });

    it('deve retornar array vazio quando produto não tem atributos', async () => {
      // Configurar mock para retornar array vazio
      db.select.mockReturnValueOnce([]);
      
      // Executar método
      const result = await productRepository.getProductAttributes(999);
      
      // Verificar chamadas ao banco de dados
      expect(db.where).toHaveBeenCalledWith('products_id', 999);
      
      // Verificar resultado
      expect(result).toHaveLength(0);
    });
  });
});
