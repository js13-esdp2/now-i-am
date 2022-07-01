import { ErrorHandler, Injectable } from '@angular/core';
import { Bugfender } from '@bugfender/sdk';

@Injectable()
export class ErrorHandlerService extends ErrorHandler {
  override handleError(error: any) {
    Bugfender.error(error);
    super.handleError(error);
  }
}
