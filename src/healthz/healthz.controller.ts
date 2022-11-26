import { Controller, Get } from '@nestjs/common';
import { HealthzService } from './healthz.service';

@Controller('healthz')
export class HealthzController {
  constructor(private readonly healthzService: HealthzService) {}

  // @Post()
  // create(@Body() createHealthzDto: CreateHealthzDto) {
  //   return this.healthzService.create(createHealthzDto);
  // }

  @Get()
  checkHealthz() {
    return this.healthzService.checkHealthz();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.healthzService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateHealthzDto: UpdateHealthzDto) {
  //   return this.healthzService.update(+id, updateHealthzDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.healthzService.remove(+id);
  // }
}
