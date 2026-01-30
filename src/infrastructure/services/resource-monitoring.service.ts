import { IResourceMonitorService } from '@application/services';
import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as os from 'os';
import { Logger } from 'winston';

@Injectable()
export class ResourceMonitorService implements IResourceMonitorService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  // Menggunakan @Cron untuk menjalankan task secara berkala
  @Cron('*/1 * * * *') // Menjalankan setiap 10 detik
  async logResourceUsage() {
    // CPU Usage
    const cpuUsage = os.cpus();
    const loadAvg = os.loadavg(); // Average load over 1, 5, 15 minutes
    const cpuInfo = cpuUsage.map((cpu) => ({
      model: cpu.model,
      speed: cpu.speed,
      times: cpu.times,
    }));

    // Memory Usage
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsage = ((usedMemory / totalMemory) * 100).toFixed(2);

    // Log resource usage
    this.logger.info(`Memory Usage: ${memoryUsage}%`, {
      context: 'ResourceMonitoring',
      cpuInfo,
      loadAvg,
      memoryUsage: Number(memoryUsage),
    });
  }
}
