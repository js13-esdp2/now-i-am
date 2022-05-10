import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appIdenticalPasswords]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ValidateIdenticalDirective,
    multi: true
  }]
})

export class ValidateIdenticalDirective implements Validator {
  @Input('appIdenticalPasswords') identicalFields: string[] = [];
  validate(control: AbstractControl): ValidationErrors | null {
    return identicalValidator(this.identicalFields)(control);
  }
}

export function identicalValidator(fields: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    const firstInput = control.get(fields[0]);
    const secondInput = control.get(fields[1]);
    if (firstInput && secondInput && firstInput.value === secondInput.value) {
      return null;
    }
    return {identicalPassword: true};
  };
}
