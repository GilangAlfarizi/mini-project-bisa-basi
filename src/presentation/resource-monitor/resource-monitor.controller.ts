import { ResourceMonitorService } from '@infrastructure/services/resource-monitoring.service';
import { Controller, Get } from '@nestjs/common';

@Controller('monitor')
export class ResouceMonitorController {
  constructor(
    private readonly resourceMonitorService: ResourceMonitorService,
  ) {}

  @Get('resource-usage')
  async getResourceUsage() {
    await this.resourceMonitorService.logResourceUsage();
    return 'Resource Usage Logged';
  }
}
