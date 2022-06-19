import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserTypeDirective } from './directives/user-type.directive';
import { ValidateIdenticalDirective } from './directives/validate-identical.directive';
import { ValidatePasswordDirective } from './directives/validate-password.directive';
import { ImagePipes } from './pipes/image.pipe';


@NgModule({
  declarations: [
    UserTypeDirective,
    ValidateIdenticalDirective,
    ValidatePasswordDirective,
    ImagePipes,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    UserTypeDirective,
    ValidateIdenticalDirective,
    ValidatePasswordDirective,
    ImagePipes,
  ]
})
export class AppDirectivesPipesModule { }
