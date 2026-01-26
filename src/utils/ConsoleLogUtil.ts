export class ConsoleLogUtil {
  private logs: Array<{ type: string; message: string; timestamp: Date }> = [];
  private isCapturing = false;

  /**
   * Start capturing console logs
   */
  startCapturing(): void {
    this.isCapturing = true;
    this.logs = [];
    
    // Override console methods to capture logs
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    console.log = (...args) => {
      if (this.isCapturing) {
        this.addLog('log', args.join(' '));
      }
      originalLog.apply(console, args);
    };

    console.error = (...args) => {
      if (this.isCapturing) {
        this.addLog('error', args.join(' '));
      }
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      if (this.isCapturing) {
        this.addLog('warn', args.join(' '));
      }
      originalWarn.apply(console, args);
    };

    console.info = (...args) => {
      if (this.isCapturing) {
        this.addLog('info', args.join(' '));
      }
      originalInfo.apply(console, args);
    };
  }

  /**
   * Stop capturing console logs
   */
  stopCapturing(): void {
    this.isCapturing = false;
    // Note: In a real implementation, you'd want to restore original console methods
  }

  /**
   * Add a log entry
   */
  private addLog(type: string, message: string): void {
    this.logs.push({
      type,
      message,
      timestamp: new Date()
    });
  }

  /**
   * Get all captured logs
   */
  getLogs(): Array<{ type: string; message: string; timestamp: Date }> {
    return [...this.logs];
  }

  /**
   * Format logs for display
   */
  formatLogs(): string {
    return this.logs.map(log => {
      const time = log.timestamp.toISOString().substring(11, 23);
      const typeIcon = this.getTypeIcon(log.type);
      return `${time} ${typeIcon} ${log.message}`;
    }).join('\n');
  }

  /**
   * Print all captured logs
   */
  printLogs(title: string = '📋 Captured Console Logs'): void {
    console.log('\n' + '='.repeat(50));
    console.log(title);
    console.log('='.repeat(50));
    
    if (this.logs.length === 0) {
      console.log('📭 No console logs captured');
    } else {
      this.logs.forEach(log => {
        const time = log.timestamp.toISOString().substring(11, 23);
        const typeIcon = this.getTypeIcon(log.type);
        console.log(`${time} ${typeIcon} ${log.message}`);
      });
    }
    
    console.log('='.repeat(50) + '\n');
  }

  /**
   * Parse console logs from test result stdout
   */
  static parseConsoleLogs(result: any): string {
    if (!result.stdout) return '';
    
    const consoleLogs = result.stdout
      .map((chunk: any) => {
        if (typeof chunk === 'string') return chunk;
        if ('text' in chunk && chunk.text) return chunk.text;
        if ('buffer' in chunk && chunk.buffer) return Buffer.from(chunk.buffer).toString('utf-8');
        return '';
      })
      .join('');

    return consoleLogs;
  }

  /**
   * Extract and format console logs from raw output
   */
  static extractAndFormatLogs(rawOutput: string): string {
    const lines = rawOutput.split('\n');
    const logLines: string[] = [];
    
    lines.forEach(line => {
      // Match common console log patterns
      if (line.includes('console.log') || 
          line.includes('console.error') || 
          line.includes('console.warn') || 
          line.includes('console.info')) {
        logLines.push(line.trim());
      }
      
      // Match custom log patterns (adjust based on your needs)
      if (line.match(/^\d{2}:\d{2}:\d{2}/) || 
          line.includes('✅') || 
          line.includes('❌') || 
          line.includes('🔗') || 
          line.includes('📧') ||
          line.includes('📋')) {
        logLines.push(line.trim());
      }
    });
    
    return logLines.join('\n');
  }

  /**
   * Print formatted test results with console logs
   */
  static printTestResults(testName: string, result: any): void {
    console.log('\n' + '🎯'.repeat(25));
    console.log(`🧪 TEST RESULT: ${testName}`);
    console.log('🎯'.repeat(50));
    
    // Print test status
    console.log(`📊 Status: ${result.status || 'Unknown'}`);
    console.log(`⏱️  Duration: ${result.duration || 'N/A'}ms`);
    
    // Print console logs from test execution
    const consoleLogs = ConsoleLogUtil.parseConsoleLogs(result);
    if (consoleLogs) {
      console.log('\n📋 Console Output During Test:');
      console.log('-'.repeat(30));
      console.log(ConsoleLogUtil.extractAndFormatLogs(consoleLogs));
    }
    
    // Print errors if any
    if (result.error) {
      console.log('\n❌ Errors:');
      console.log('-'.repeat(30));
      console.log(result.error);
    }
    
    console.log('🎯'.repeat(50) + '\n');
  }

  /**
   * Get icon for log type
   */
  private getTypeIcon(type: string): string {
    switch (type) {
      case 'error': return '❌';
      case 'warn': return '⚠️';
      case 'info': return 'ℹ️';
      case 'log': 
      default: return '📝';
    }
  }

  /**
   * Create a console logger that captures logs during test execution
   */
  static createTestLogger() {
    return {
      log: (...args: any[]) => {
        const message = args.join(' ');
        const timestamp = new Date().toISOString().substring(11, 23);
        console.log(`${timestamp} 📝 ${message}`);
      },
      
      error: (...args: any[]) => {
        const message = args.join(' ');
        const timestamp = new Date().toISOString().substring(11, 23);
        console.error(`${timestamp} ❌ ${message}`);
      },
      
      warn: (...args: any[]) => {
        const message = args.join(' ');
        const timestamp = new Date().toISOString().substring(11, 23);
        console.warn(`${timestamp} ⚠️ ${message}`);
      },
      
      info: (...args: any[]) => {
        const message = args.join(' ');
        const timestamp = new Date().toISOString().substring(11, 23);
        console.info(`${timestamp} ℹ️ ${message}`);
      },
      
      success: (...args: any[]) => {
        const message = args.join(' ');
        const timestamp = new Date().toISOString().substring(11, 23);
        console.log(`${timestamp} ✅ ${message}`);
      },
      
      step: (stepNumber: number, description: string) => {
        const timestamp = new Date().toISOString().substring(11, 23);
        console.log(`${timestamp} ${stepNumber}️⃣ ${description}`);
      }
    };
  }

  /**
   * Clear all captured logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Get logs by type
   */
  getLogsByType(type: string): Array<{ type: string; message: string; timestamp: Date }> {
    return this.logs.filter(log => log.type === type);
  }

  /**
   * Get recent logs (last N logs)
   */
  getRecentLogs(count: number = 10): Array<{ type: string; message: string; timestamp: Date }> {
    return this.logs.slice(-count);
  }
}