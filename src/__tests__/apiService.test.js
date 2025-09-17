// apiService.test.js
// API服务的单元测试

import apiService from '../apiService.js';
import API_CONFIG from '../apiConfig.js';
import authService from '../authService.js';

// Mock fetch
global.fetch = jest.fn();

// Mock authService
jest.mock('../authService.js', () => ({
  getToken: jest.fn(),
  isAuthenticated: jest.fn()
}));

describe('apiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFullUrl', () => {
    it('should correctly build full URL with endpoint', () => {
      const endpoint = '/test/endpoint';
      const fullUrl = apiService.getFullUrl(endpoint);

      expect(fullUrl).toBe(`${API_CONFIG.BASE_URL}${endpoint}`);
    });

    it('should handle endpoints starting with base URL', () => {
      const endpoint = `${API_CONFIG.BASE_URL}/test/endpoint`;
      const fullUrl = apiService.getFullUrl(endpoint);

      expect(fullUrl).toBe(endpoint);
    });

    it('should handle empty endpoint', () => {
      const fullUrl = apiService.getFullUrl('');

      expect(fullUrl).toBe(API_CONFIG.BASE_URL);
    });

    it('should handle null endpoint', () => {
      const fullUrl = apiService.getFullUrl(null);

      expect(fullUrl).toBe(API_CONFIG.BASE_URL);
    });
  });

  describe('apiRequest', () => {
    const mockEndpoint = '/test/endpoint';
    const mockData = { key: 'value' };

    beforeEach(() => {
      authService.getToken.mockReturnValue('mock-jwt-token');
      authService.isAuthenticated.mockReturnValue(true);
    });

    it('should make GET request with auth headers when authenticated', async () => {
      const mockResponse = { success: true, data: 'test data' };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await apiService.apiRequest(mockEndpoint, 'GET');

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_CONFIG.BASE_URL}${mockEndpoint}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token'
          }
        }
      );
    });

    it('should make POST request with data and auth headers', async () => {
      const mockResponse = { success: true, data: 'created data' };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await apiService.apiRequest(mockEndpoint, 'POST', mockData);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_CONFIG.BASE_URL}${mockEndpoint}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token'
          },
          body: JSON.stringify(mockData)
        }
      );
    });

    it('should make request without auth headers when not authenticated', async () => {
      const mockResponse = { success: true, data: 'public data' };
      authService.isAuthenticated.mockReturnValue(false);
      authService.getToken.mockReturnValue(null);

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await apiService.apiRequest(mockEndpoint, 'GET');

      expect(result).toEqual(mockResponse);
      const calledHeaders = global.fetch.mock.calls[0][1].headers;
      expect(calledHeaders).not.toHaveProperty('Authorization');
    });

    it('should handle API errors with status code', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'API error occurred'
      };

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve(mockErrorResponse)
      });

      await expect(apiService.apiRequest(mockEndpoint, 'GET')).rejects.toThrow(
        'API请求失败: 400 - API error occurred'
      );
    });

    it('should handle API errors with default message when no JSON response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({})
      });

      await expect(apiService.apiRequest(mockEndpoint, 'GET')).rejects.toThrow(
        'API请求失败: 500 - 未知错误'
      );
    });

    it('should handle network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(apiService.apiRequest(mockEndpoint, 'GET')).rejects.toThrow(
        '网络请求失败: Network error'
      );
    });

    it('should handle JSON parsing errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON'))
      });

      await expect(apiService.apiRequest(mockEndpoint, 'GET')).rejects.toThrow(
        '数据解析错误: Invalid JSON'
      );
    });

    it('should support custom headers', async () => {
      const mockResponse = { success: true };
      const customHeaders = {
        'X-Custom-Header': 'custom-value',
        'Content-Type': 'application/xml'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      await apiService.apiRequest(mockEndpoint, 'GET', null, customHeaders);

      const calledHeaders = global.fetch.mock.calls[0][1].headers;
      expect(calledHeaders).toEqual({
        ...customHeaders,
        'Authorization': 'Bearer mock-jwt-token'
      });
    });

    it('should support custom request options', async () => {
      const mockResponse = { success: true };
      const customOptions = {
        mode: 'cors',
        cache: 'no-cache'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      await apiService.apiRequest(mockEndpoint, 'GET', null, {}, customOptions);

      const calledOptions = global.fetch.mock.calls[0][1];
      expect(calledOptions.mode).toBe('cors');
      expect(calledOptions.cache).toBe('no-cache');
    });

    it('should handle DELETE requests', async () => {
      const mockResponse = { success: true, message: 'Deleted successfully' };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await apiService.apiRequest(mockEndpoint, 'DELETE');

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_CONFIG.BASE_URL}${mockEndpoint}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token'
          }
        }
      );
    });

    it('should handle PUT requests with data', async () => {
      const mockResponse = { success: true, data: 'updated data' };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await apiService.apiRequest(mockEndpoint, 'PUT', mockData);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_CONFIG.BASE_URL}${mockEndpoint}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token'
          },
          body: JSON.stringify(mockData)
        }
      );
    });
  });

  describe('通用API方法', () => {
    it('should have all required API methods defined', () => {
      expect(apiService).toHaveProperty('get');
      expect(apiService).toHaveProperty('post');
      expect(apiService).toHaveProperty('put');
      expect(apiService).toHaveProperty('delete');
      expect(apiService).toHaveProperty('patch');
      expect(typeof apiService.get).toBe('function');
      expect(typeof apiService.post).toBe('function');
      expect(typeof apiService.put).toBe('function');
      expect(typeof apiService.delete).toBe('function');
      expect(typeof apiService.patch).toBe('function');
    });

    it('should call apiRequest with GET method', async () => {
      const mockResponse = { success: true };
      const spy = jest.spyOn(apiService, 'apiRequest').mockResolvedValue(mockResponse);

      const result = await apiService.get('/test');

      expect(spy).toHaveBeenCalledWith('/test', 'GET', null, {}, {});
      expect(result).toBe(mockResponse);
    });

    it('should call apiRequest with POST method and data', async () => {
      const mockResponse = { success: true };
      const data = { test: 'data' };
      const spy = jest.spyOn(apiService, 'apiRequest').mockResolvedValue(mockResponse);

      const result = await apiService.post('/test', data);

      expect(spy).toHaveBeenCalledWith('/test', 'POST', data, {}, {});
      expect(result).toBe(mockResponse);
    });

    it('should call apiRequest with PUT method and data', async () => {
      const mockResponse = { success: true };
      const data = { test: 'data' };
      const spy = jest.spyOn(apiService, 'apiRequest').mockResolvedValue(mockResponse);

      const result = await apiService.put('/test', data);

      expect(spy).toHaveBeenCalledWith('/test', 'PUT', data, {}, {});
      expect(result).toBe(mockResponse);
    });

    it('should call apiRequest with DELETE method', async () => {
      const mockResponse = { success: true };
      const spy = jest.spyOn(apiService, 'apiRequest').mockResolvedValue(mockResponse);

      const result = await apiService.delete('/test');

      expect(spy).toHaveBeenCalledWith('/test', 'DELETE', null, {}, {});
      expect(result).toBe(mockResponse);
    });
  });
});