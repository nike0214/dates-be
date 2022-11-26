import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class HealthzService {
  async checkHealthz() {
    // TODO- 상태체크 로직 추가 필요
    // return HttpException('Failed to Check Health', 500);

    return { data: { status: 'OK' } };
  }
  // create(createHealthzDto: CreateHealthzDto) {
  //   return 'This action adds a new healthz';
  // }

  // findAll() {
  //   return `This action returns all healthz`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} healthz`;
  // }

  // update(id: number, updateHealthzDto: UpdateHealthzDto) {
  //   return `This action updates a #${id} healthz`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} healthz`;
  // }
}
