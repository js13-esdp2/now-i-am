import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
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
import { UserTypeDirective } from './directives/user-type.directive';
import { MatMenuModule } from '@angular/material/menu';
import { HomeComponent } from './pages/home/home.component';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule,
  VKLoginProvider
} from 'angularx-social-login';
import { environment } from '../environments/environment';
import { PostsComponent } from './pages/posts/posts.component';
import { NewPostComponent } from './pages/new-post/new-post.component';
import { FileInputComponent } from './ui/file-input/file-input.component';
import { MatSelectModule } from '@angular/material/select';
import { ModalWindowComponent } from './ui/modal-window/modal-window.component';
import { WebcamComponent } from './ui/webcam/webcam.component';
import { WebcamModule } from 'ngx-webcam';
import { ProfileComponent } from './pages/profile/profile.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { AuthInterceptor } from './auth.interceptor';
import { SearchComponent } from './pages/search/search.component';
import { ImagePipes } from './pipes/image.pipe';
import { PostModalComponent } from './ui/post-modal/post-modal.component';
import { StatisticComponent } from './pages/statistic/statistic.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MapService } from './services/map.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ChatComponent } from './pages/chat/chat.component';
import { ChatRoomComponent } from './pages/chat/chat-room/chat-room.component';
import { MyHistoryPostsComponent } from './pages/my-history-posts/my-history-posts.component';
import { UserFriendsComponent } from './pages/user-friends/user-friends.component';
import { ProfileModalComponent } from './ui/profile-modal/profile-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { CheckPasswordComponent } from './pages/check-password/check-password.component';
import { RecoveryModalComponent } from './ui/recovery-modal/recovery-modal.component';
import { ValidateIdenticalDirective } from './directives/validate-identical.directive';
import { ValidatePasswordDirective } from './directives/validate-password.directive';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DeleteChatModalComponent } from './ui/delete-chat-modal/delete-chat-modal.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ChatListComponent } from './pages/chat/chat-list/chat-list.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { WebsocketService } from './services/websocket.service';
import { MatBadgeModule } from '@angular/material/badge';
import { NgxEmojiPickerModule } from 'ngx-emoji-picker';
import { AutocompleteCategoriesComponent } from './ui/autocomplete-categories/autocomplete-categories.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LikesModalComponent } from './ui/likes-modal/likes-modal.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { LiveStreamComponent } from './pages/live-stream/live-stream.component';
import { Bugfender } from '@bugfender/sdk';
import { ErrorHandlerService } from './services/error-handler.service';

const vkLoginOptions = {
  fields: 'photo_max',
  version: '5.124',
};

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
    },
    {
      id: VKLoginProvider.PROVIDER_ID,
      provider: new VKLoginProvider(environment.vkAppId, vkLoginOptions)
    },
  ]
}

Bugfender.init({
  appKey: environment.bugfenderKey,
});

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
    ChangePasswordComponent,
    ModalWindowComponent,
    WebcamComponent,
    PostModalComponent,
    StatisticComponent,
    ChatComponent,
    ChatRoomComponent,
    MyHistoryPostsComponent,
    UserFriendsComponent,
    ProfileModalComponent,
    CheckPasswordComponent,
    RecoveryModalComponent,
    ValidateIdenticalDirective,
    ValidatePasswordDirective,
    NotificationsComponent,
    DeleteChatModalComponent,
    ChatListComponent,
    ChatRoomComponent,
    AutocompleteCategoriesComponent,
    LikesModalComponent,
    LiveStreamComponent,
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
    MatMenuModule,
    SocialLoginModule,
    MatSelectModule,
    WebcamModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatSliderModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    NgxEmojiPickerModule.forRoot(),
    MatSlideToggleModule,
    MatProgressBarModule,
    MatIconModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: 'SocialAuthServiceConfig', useValue: socialConfig },
    MapService,
    WebsocketService,
    {
      provide: APP_INITIALIZER,
      useFactory: (ws: WebsocketService) => () => ws.initialize(),
      deps: [WebsocketService],
      multi: true
    },
    { provide: ErrorHandler, useClass: ErrorHandlerService },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
