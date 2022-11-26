import { DynamicModule, Global, Module } from '@nestjs/common';
import { EthereumSigService } from './ethereumSig.service';

@Module({})
@Global()
export class EthereumSigModule {
  static forRoot(): DynamicModule {
    return {
      module: EthereumSigModule,
      providers: [EthereumSigService],
      exports: [EthereumSigService],
    };
  }
}
