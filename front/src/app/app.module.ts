import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppStoreModule } from './app-store.module';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './ui/layout/layout.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FlexModule } from '@angular/flex-layout';
import { CenteredCardComponent } from './ui/centered-card/centered-card.component';
import { LoaderComponent } from './ui/loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { UserTypeDirective } from './directives/user-type.directive';
import { MatMenuModule } from '@angular/material/menu';
import { HomeComponent } from './pages/home/home.component';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule
} from 'angularx-social-login';
import { environment } from '../environments/environment';
import { PostsComponent } from './pages/posts/posts.component';
import { NewPostComponent } from './pages/new-post/new-post.component';
import { FileInputComponent } from './ui/file-input/file-input.component';
import { MatSelectModule } from '@angular/material/select';
import { ModalWindowComponent } from './ui/modal-window/modal-window.component';
import { WebcamComponent } from './ui/webcam/webcam.component';
import { WebcamModule } from 'ngx-webcam';
import { MatDialogModule } from '@angular/material/dialog';
import { ProfileComponent } from './pages/profile/profile.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { AuthInterceptor } from './auth.interceptor';

const socialConfig: SocialAuthServiceConfig = {
  autoLogin: false,
  providers: [
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider(environment.facebookAppId, {
        scope: 'email,public_profile'
      })
    },
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(environment.googleAppId)
    }
  ]
}
import { SearchComponent } from './pages/search/search.component';
import { ImagePipes } from './pipes/image.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    LayoutComponent,
    CenteredCardComponent,
    LoaderComponent,
    UserTypeDirective,
    HomeComponent,
    ImagePipes,
    SearchComponent,
    HomeComponent,
    PostsComponent,
    NewPostComponent,
    FileInputComponent,
    ProfileComponent,
    EditProfileComponent,
    ModalWindowComponent,
    WebcamComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSnackBarModule,
    AppStoreModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    FlexModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    SocialLoginModule,
    MatSelectModule,
    WebcamModule,
    MatDialogModule,
    MatCheckboxModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: 'SocialAuthServiceConfig', useValue: socialConfig },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
