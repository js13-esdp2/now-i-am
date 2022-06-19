import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppStoreModule } from './app-store.module';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './ui/layout/layout.component';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CenteredCardComponent } from './ui/centered-card/centered-card.component';
import { LoaderComponent } from './ui/loader/loader.component';
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
import { ModalWindowComponent } from './ui/modal-window/modal-window.component';
import { WebcamComponent } from './ui/webcam/webcam.component';
import { WebcamModule } from 'ngx-webcam';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { AuthInterceptor } from './auth.interceptor';
import { SearchComponent } from './pages/search/search.component';
import { PostModalComponent } from './ui/post-modal/post-modal.component';
import { StatisticComponent } from './pages/statistic/statistic.component';
import { MapService } from './services/map.service';
import { MatNativeDateModule } from '@angular/material/core';
import { ChatComponent } from './pages/chat/chat.component';
import { ChatRoomComponent } from './pages/chat/chat-room/chat-room.component';
import { MyHistoryPostsComponent } from './pages/my-history-posts/my-history-posts.component';
import { UserFriendsComponent } from './pages/user-friends/user-friends.component';
import { ProfileModalComponent } from './ui/profile-modal/profile-modal.component';
import { CheckPasswordComponent } from './pages/check-password/check-password.component';
import { RecoveryModalComponent } from './ui/recovery-modal/recovery-modal.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { DeleteChatModalComponent } from './ui/delete-chat-modal/delete-chat-modal.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ChatListComponent } from './pages/chat/chat-list/chat-list.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { WebsocketService } from './services/websocket.service';
import { MatBadgeModule } from '@angular/material/badge';
import { NgxEmojiPickerModule } from 'ngx-emoji-picker';
import { AutocompleteCategoriesComponent } from './ui/autocomplete-categories/autocomplete-categories.component';
import { LikesModalComponent } from './ui/likes-modal/likes-modal.component';
import { AppDirectivesPipesModule } from './app.directives-pipes.module';
import { AppUiModule } from './app.ui.module';

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


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    LayoutComponent,
    CenteredCardComponent,
    LoaderComponent,
    HomeComponent,
    SearchComponent,
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
    NotificationsComponent,
    DeleteChatModalComponent,
    ChatListComponent,
    AutocompleteCategoriesComponent,
    LikesModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppUiModule,
    AppDirectivesPipesModule,
    AppStoreModule,
    HttpClientModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule,
    WebcamModule,
    MatNativeDateModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatBadgeModule,
    NgxEmojiPickerModule.forRoot(),
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
