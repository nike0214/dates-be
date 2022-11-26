import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EthereumJsModuleOptions } from './ethereumJs.interfaces';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { EthereumJsService } from './ethereumJs.service';

@Module({})
@Global()
export class EthereumJsModule {
  static forRoot(options: EthereumJsModuleOptions): DynamicModule {
    return {
      module: EthereumJsModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        EthereumJsService,
      ],
      exports: [EthereumJsService],
    };
  }
}
