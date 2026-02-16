import { logger, LogLevel, AppError } from '../utils/logger';

// Mock console methods
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleDebug = jest.spyOn(console, 'debug').mockImplementation();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Logger', () => {
  beforeEach(() => {
    logger.clearLogs();
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
    mockConsoleWarn.mockRestore();
    mockConsoleLog.mockRestore();
    mockConsoleDebug.mockRestore();
  });

  describe('Basic logging functionality', () => {
    it('should log error messages', () => {
      const message = 'Test error message';
      const context = { userId: '123', action: 'test' };
      
      logger.error(message, context);
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        expect.stringContaining('ERROR'),
        expect.stringContaining(message),
        expect.stringContaining(JSON.stringify(context))
      );
      
      const logs = logger.getLogs(LogLevel.ERROR);
      expect(logs).toHaveLength(1);
      expect(logs[0].message).toBe(message);
      expect(logs[0].context).toEqual(context);
      expect(logs[0].level).toBe(LogLevel.ERROR);
    });

    it('should log warning messages', () => {
      const message = 'Test warning message';
      
      logger.warn(message);
      
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('WARN'),
        expect.stringContaining(message)
      );
      
      const logs = logger.getLogs(LogLevel.WARN);
      expect(logs).toHaveLength(1);
      expect(logs[0].message).toBe(message);
    });

    it('should log info messages', () => {
      const message = 'Test info message';
      
      logger.info(message);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('INFO'),
        expect.stringContaining(message)
      );
      
      const logs = logger.getLogs(LogLevel.INFO);
      expect(logs).toHaveLength(1);
    });

    it('should log debug messages', () => {
      const message = 'Test debug message';
      
      logger.debug(message);
      
      expect(mockConsoleDebug).toHaveBeenCalledWith(
        expect.stringContaining('DEBUG'),
        expect.stringContaining(message)
      );
      
      const logs = logger.getLogs(LogLevel.DEBUG);
      expect(logs).toHaveLength(1);
    });
  });

  describe('User context handling', () => {
    it('should include user ID when available in localStorage', () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));
      
      logger.info('Test message with user');
      
      const logs = logger.getLogs();
      expect(logs[0].userId).toBe('user123');
    });

    it('should handle invalid user data in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      logger.info('Test message with invalid user');
      
      const logs = logger.getLogs();
      expect(logs[0].userId).toBeUndefined();
    });

    it('should handle missing user data', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      logger.info('Test message without user');
      
      const logs = logger.getLogs();
      expect(logs[0].userId).toBeUndefined();
    });
  });

  describe('Log management', () => {
    it('should limit number of logs to prevent memory issues', () => {
      // Add more logs than the limit
      for (let i = 0; i < 1050; i++) {
        logger.info(`Message ${i}`);
      }
      
      const allLogs = logger.getLogs();
      expect(allLogs.length).toBeLessThanOrEqual(1000);
      expect(allLogs.length).toBeGreaterThan(900); // Should keep recent logs
    });

    it('should export logs as formatted string', () => {
      logger.error('Error message');
      logger.warn('Warning message');
      
      const exported = logger.exportLogs();
      
      expect(exported).toContain('ERROR');
      expect(exported).toContain('Error message');
      expect(exported).toContain('WARN');
      expect(exported).toContain('Warning message');
    });

    it('should clear all logs', () => {
      logger.error('Test error');
      logger.warn('Test warning');
      expect(logger.getLogs()).toHaveLength(2);
      
      logger.clearLogs();
      expect(logger.getLogs()).toHaveLength(0);
    });
  });

  describe('Request ID generation', () => {
    it('should generate unique request IDs for each log entry', () => {
      logger.info('Message 1');
      logger.info('Message 2');
      
      const logs = logger.getLogs();
      expect(logs[0].requestId).toBeDefined();
      expect(logs[1].requestId).toBeDefined();
      expect(logs[0].requestId).not.toBe(logs[1].requestId);
    });

    it('should generate valid request ID format', () => {
      logger.info('Test message');
      
      const logs = logger.getLogs();
      const requestId = logs[0].requestId;
      expect(requestId).toMatch(/^[a-z0-9]{9}$/); // 9 character alphanumeric
    });
  });
});

describe('AppError', () => {
  beforeEach(() => {
    logger.clearLogs();
    jest.clearAllMocks();
  });

  it('should create error with context', () => {
    const message = 'Test application error';
    const context = { userId: '123', action: 'test' };
    
    const error = new AppError(message, context);
    
    expect(error.message).toBe(message);
    expect(error.context).toEqual(context);
    expect(error.name).toBe('AppError');
    expect(error.timestamp).toBeDefined();
  });

  it('should log error automatically when created', () => {
    const message = 'Auto-logged error';
    const context = { component: 'TestComponent' };
    
    new AppError(message, context);
    
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining('ERROR'),
      expect.stringContaining(message),
      expect.stringContaining(JSON.stringify(context))
    );
  });

  it('should work as Error instance', () => {
    const error = new AppError('Test error');
    
    expect(error instanceof Error).toBe(true);
    expect(error instanceof AppError).toBe(true);
  });
});
