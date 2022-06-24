import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { NewPostComponent } from './pages/new-post/new-post.component';
import { PostsComponent } from './pages/posts/posts.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { StatisticComponent } from './pages/statistic/statistic.component';
import { ChatComponent } from './pages/chat/chat.component';
import { MyHistoryPostsComponent } from './pages/my-history-posts/my-history-posts.component';
import { AuthGuardService } from './services/auth-guard.service';
import { UserFriendsComponent } from './pages/user-friends/user-friends.component';
import { CheckPasswordComponent } from './pages/check-password/check-password.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ChatListComponent } from './pages/chat/chat-list/chat-list.component';
import { ChatRoomComponent } from './pages/chat/chat-room/chat-room.component';
import { UserGuardService } from './services/user-guard.service';
import { LiveStreamComponent } from './pages/live-stream/live-stream.component';

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [UserGuardService]},
  {path: '', children: [
      {path: '', component: HomeComponent},
      {path: 'profile',
        canActivate: [AuthGuardService],
        children: [
          {path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuardService]},
          {path: '', component: ProfileComponent, canActivate: [AuthGuardService]},
          {path: 'edit', component: EditProfileComponent, canActivate: [AuthGuardService]}
      ]}
  ]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'search', component: SearchComponent,
    canActivate: [AuthGuardService]},
  {path: 'register', component: RegisterComponent},
  {path: 'new-post', component: NewPostComponent,
    canActivate: [AuthGuardService]},
  {path: 'posts', component: PostsComponent},
  {path: 'statistic', component: StatisticComponent},
  {path: 'chat', component: ChatComponent, canActivate: [AuthGuardService]},
  {path: 'chat-list', component: ChatListComponent, canActivate: [AuthGuardService]},
  {path: 'chat-room/:id', component: ChatRoomComponent, canActivate: [AuthGuardService]},
  {path: 'friends', component: UserFriendsComponent, canActivate: [AuthGuardService]},
  {path: 'password-check', component: CheckPasswordComponent},
  {
    path: 'my-history-posts',
    component: MyHistoryPostsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [AuthGuardService]
  },
  { path: 'live', component: LiveStreamComponent, canActivate: [AuthGuardService] },
  { path: 'live/:id', component: LiveStreamComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
