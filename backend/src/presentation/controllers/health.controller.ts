// Health Check Endpoint con Monitoring Completo
import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../../infrastructure/database/prisma.service';

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  checks: {
    database: { status: string; responseTime: number };
    memory: { status: string; usage: NodeJS.MemoryUsage };
  };
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);
  private readonly startTime = Date.now();

  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  async check(): Promise<HealthCheckResult> {
    const checks = {
      database: await this.checkDatabase(),
      memory: this.checkMemory(),
    };

    const isHealthy = checks.database.status === 'up' && checks.memory.status === 'ok';

    return {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      version: process.env.npm_package_version || '1.0.0',
      checks,
    };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe' })
  async ready(): Promise<{ ready: boolean }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { ready: true };
    } catch {
      return { ready: false };
    }
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness probe' })
  async live(): Promise<{ alive: boolean }> {
    return { alive: true };
  }

  private async checkDatabase(): Promise<{ status: string; responseTime: number }> {
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'up', responseTime: Date.now() - start };
    } catch (error) {
      this.logger.error(`Database health check failed: ${error.message}`);
      return { status: 'down', responseTime: Date.now() - start };
    }
  }

  private checkMemory(): { status: string; usage: NodeJS.MemoryUsage } {
    const usage = process.memoryUsage();
    const heapUsedMB = usage.heapUsed / 1024 / 1024;
    const status = heapUsedMB > 512 ? 'warning' : 'ok';
    return { status, usage };
  }
}
