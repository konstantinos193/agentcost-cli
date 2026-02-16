export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
  userId?: string;
  requestId?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private formatLog(entry: LogEntry): string {
    const timestamp = entry.timestamp;
    const level = entry.level.padEnd(5);
    const userId = entry.userId ? `[${entry.userId}]` : '';
    const requestId = entry.requestId ? `[${entry.requestId}]` : '';
    const context = entry.context ? ` | Context: ${JSON.stringify(entry.context)}` : '';
    
    return `${timestamp} ${level} ${userId}${requestId} ${entry.message}${context}`;
  }

  private createLogEntry(level: LogLevel, message: string, context?: any): LogEntry {
    const requestId = this.generateRequestId();
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      userId: this.getCurrentUserId(),
      requestId
    };
  }

  private getCurrentUserId(): string | undefined {
    // In a real app, this would come from authentication context
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('agentcost_user');
      if (user) {
        try {
          const parsed = JSON.parse(user);
          return parsed.id;
        } catch {
          return undefined;
        }
      }
    }
    return undefined;
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  error(message: string, context?: any) {
    const entry = this.createLogEntry(LogLevel.ERROR, message, context);
    this.logs.push(entry);
    console.error(this.formatLog(entry));
    this.trimLogs();
  }

  warn(message: string, context?: any) {
    const entry = this.createLogEntry(LogLevel.WARN, message, context);
    this.logs.push(entry);
    console.warn(this.formatLog(entry));
    this.trimLogs();
  }

  info(message: string, context?: any) {
    const entry = this.createLogEntry(LogLevel.INFO, message, context);
    this.logs.push(entry);
    console.log(this.formatLog(entry));
    this.trimLogs();
  }

  debug(message: string, context?: any) {
    const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
    this.logs.push(entry);
    console.debug(this.formatLog(entry));
    this.trimLogs();
  }

  private trimLogs() {
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return this.logs.map(log => this.formatLog(log)).join('\n');
  }
}

export const logger = new Logger();

// Error boundary for React components
export class AppError extends Error {
  public readonly context?: any;
  public readonly userId?: string;
  public readonly timestamp: string;

  constructor(message: string, context?: any) {
    super(message);
    this.name = 'AppError';
    this.context = context;
    this.timestamp = new Date().toISOString();
    
    // Log the error immediately
    logger.error(message, context);
  }
}

// Utility function to wrap async functions with error handling
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      const result = await fn(...args);
      logger.debug(`${context || fn.name} completed successfully`);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`${context || fn.name} failed: ${errorMessage}`, {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        args: args.length > 0 ? args : undefined
      });
      throw error;
    }
  }) as T;
}
