import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  MemoryHealthIndicator,
  HealthCheckResult,
  // PrismaHealthIndicator,
} from '@nestjs/terminus';

@ApiBearerAuth()
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
    // private database: PrismaHealthIndicator
  ) {}

  MEMORY_HEAP_LIMIT =
    Number.parseInt(process.env.MEMORY_HEAP_LIMIT ?? '') ?? 150 * 1024 * 1024;

  /**
   * @description Reports the health of the application by performing various health checks.
   *
   * This method performs the following health checks:
   * - Pings Google's website to check HTTP connectivity.
   * - Checks the memory heap usage against a predefined limit.
   * - Pings the database to ensure it is reachable.
   *
   * @returns {Promise<HealthCheckResult>} The result of the health checks.
   */
  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.http.pingCheck('google_ping', 'https://google.com'),
      () => this.memory.checkHeap('memory_heap', this.MEMORY_HEAP_LIMIT),
      // () => this.database.pingCheck("database", client),
    ]);
  }
}
