import { Injectable } from '@nestjs/common';
import { recoverPersonalSignature } from 'eth-sig-util';

@Injectable()
export class EthereumSigService {
  recoverPersonalSignature({ data, sig }): string {
    return recoverPersonalSignature({ data, sig });
  }
}
