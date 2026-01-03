import { ApplicationError, type AppError } from '../types/errors'

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
  error?: AppError
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 100
  private isDevelopment = import.meta.env.DEV

  debug(message: string, data?: any) {
    this.log(LogLevel.DEBUG, message, data)
  }

  info(message: string, data?: any) {
    this.log(LogLevel.INFO, message, data)
  }

  warn(message: string, data?: any) {
    this.log(LogLevel.WARN, message, data)
  }

  error(message: string, error?: Error | ApplicationError, data?: any) {
    const appError = error instanceof ApplicationError ? error : undefined
    this.log(LogLevel.ERROR, message, data, appError)

    // Log to console in development
    if (this.isDevelopment) {
      console.error(`[ERROR] ${message}`, error, data)
    }
  }

  private log(level: LogLevel, message: string, data?: any, error?: AppError) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      error,
    }

    this.logs.push(entry)

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Log to console in development
    if (this.isDevelopment) {
      const levelName = LogLevel[level]
      console.log(`[${levelName}] ${message}`, data || '')
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

export const logger = new Logger()
