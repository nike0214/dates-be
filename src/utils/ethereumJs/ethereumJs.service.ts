import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { Inject, Injectable } from '@nestjs/common';
import { bufferToHex, isValidChecksumAddress } from 'ethereumjs-util';
import { EthereumJsModuleOptions } from './ethereumJs.interfaces';

@Injectable()
export class EthereumJsService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: EthereumJsModuleOptions,
  ) {}

  bufferToHex(msg: string): string {
    return bufferToHex(Buffer.from(msg, this.options.encoding));
  }

  isValidChecksumAddress(address: string): boolean {
    return isValidChecksumAddress(address);
  }
}
