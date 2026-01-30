import { ResourceMonitorService } from '@infrastructure/services/resource-monitoring.service';
import { Module } from '@nestjs/common';

import { ResouceMonitorController } from './resource-monitor.controller';

@Module({
  controllers: [ResouceMonitorController],
  providers: [ResourceMonitorService],
})
export class ResourceMonitorModule {}
