// authService.test.js
// 认证服务的单元测试

import authService from '../authService.js';

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

// Mock fetch
global.fetch = jest.fn();

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockResponse = {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          username: 'testuser',
          role: 'user'
        },
        success: true
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await authService.login('testuser', 'password123');

      expect(result).toEqual(mockResponse);
      expect(global.localStorage.setItem).toHaveBeenCalledWith('token', 'mock-jwt-token');
      expect(global.localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.user));
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('auth/login'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({'Content-Type': 'application/json'}),
          body: JSON.stringify({ username: 'testuser', password: 'password123' })
        })
      );
    });

    it('should fail login with invalid credentials', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Invalid username or password'
      };

      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve(mockErrorResponse)
      });

      await expect(authService.login('wronguser', 'wrongpass')).rejects.toThrow('Invalid username or password');
      expect(global.localStorage.setItem).not.toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(authService.login('testuser', 'password123')).rejects.toThrow('Network error');
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const mockResponse = {
        success: true,
        message: 'User registered successfully'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const userData = {
        username: 'newuser',
        password: 'password123',
        email: 'newuser@example.com',
        fullName: 'New User'
      };

      const result = await authService.register(userData);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('auth/register'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({'Content-Type': 'application/json'}),
          body: JSON.stringify(userData)
        })
      );
    });

    it('should fail registration with duplicate username', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Username already exists'
      };

      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve(mockErrorResponse)
      });

      const userData = {
        username: 'existinguser',
        password: 'password123',
        email: 'existing@example.com',
        fullName: 'Existing User'
      };

      await expect(authService.register(userData)).rejects.toThrow('Username already exists');
    });
  });

  describe('logout', () => {
    it('should successfully logout and clear storage', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });

      global.localStorage.getItem.mockReturnValue('mock-jwt-token');

      await authService.logout();

      expect(global.localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(global.localStorage.removeItem).toHaveBeenCalledWith('user');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('auth/logout'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token'
          })
        })
      );
    });

    it('should handle logout even if token is not present', async () => {
      global.localStorage.getItem.mockReturnValue(null);

      await authService.logout();

      expect(global.localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(global.localStorage.removeItem).toHaveBeenCalledWith('user');
    });

    it('should handle logout API errors gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('API error'));
      global.localStorage.getItem.mockReturnValue('mock-jwt-token');

      // 即使API失败，也应该继续清除本地存储
      await authService.logout();

      expect(global.localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(global.localStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when token exists', () => {
      const mockUser = { id: '1', username: 'testuser', role: 'user' };
      global.localStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      const user = authService.getCurrentUser();

      expect(user).toEqual(mockUser);
      expect(global.localStorage.getItem).toHaveBeenCalledWith('user');
    });

    it('should return null when no user exists', () => {
      global.localStorage.getItem.mockReturnValue(null);

      const user = authService.getCurrentUser();

      expect(user).toBeNull();
    });

    it('should handle invalid JSON in user storage', () => {
      global.localStorage.getItem.mockReturnValue('invalid-json');

      const user = authService.getCurrentUser();

      expect(user).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      global.localStorage.getItem.mockReturnValue('mock-jwt-token');

      const isAuth = authService.isAuthenticated();

      expect(isAuth).toBe(true);
      expect(global.localStorage.getItem).toHaveBeenCalledWith('token');
    });

    it('should return false when no token exists', () => {
      global.localStorage.getItem.mockReturnValue(null);

      const isAuth = authService.isAuthenticated();

      expect(isAuth).toBe(false);
    });
  });

  describe('getToken', () => {
    it('should return token when it exists', () => {
      global.localStorage.getItem.mockReturnValue('mock-jwt-token');

      const token = authService.getToken();

      expect(token).toBe('mock-jwt-token');
      expect(global.localStorage.getItem).toHaveBeenCalledWith('token');
    });

    it('should return null when no token exists', () => {
      global.localStorage.getItem.mockReturnValue(null);

      const token = authService.getToken();

      expect(token).toBeNull();
    });
  });

  describe('checkAuthStatus', () => {
    it('should return true with user data when authenticated', () => {
      const mockUser = { id: '1', username: 'testuser', role: 'user' };
      global.localStorage.getItem.mockImplementation(key => {
        if (key === 'token') return 'mock-jwt-token';
        if (key === 'user') return JSON.stringify(mockUser);
        return null;
      });

      const status = authService.checkAuthStatus();

      expect(status).toEqual({
        isAuthenticated: true,
        user: mockUser
      });
    });

    it('should return false with null user when not authenticated', () => {
      global.localStorage.getItem.mockReturnValue(null);

      const status = authService.checkAuthStatus();

      expect(status).toEqual({
        isAuthenticated: false,
        user: null
      });
    });
  });
});