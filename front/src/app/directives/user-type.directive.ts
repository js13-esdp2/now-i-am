import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../store/types';

@Directive({
  selector: '[appUserType]'
})
export class UserTypeDirective implements OnInit, OnDestroy {

  user: Observable<null | User>;
  userSub!: Subscription;

  @Input("appUserType") type!: string;
  @Input("appUserTypeElse") elseTemplate?: TemplateRef<any>;

  constructor(
    private store: Store<AppState>,
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
  ) {
    this.user = store.select( state => state.users.user);
  }

  ngOnInit() {
    this.userSub = this.user.subscribe( user => {
      this.viewContainer.clear();

      if ((this.type === 'user' && user) || (this.type === 'anon' && !user)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else if (this.elseTemplate) {
        this.viewContainer.createEmbeddedView(this.elseTemplate);
      }
    })
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
