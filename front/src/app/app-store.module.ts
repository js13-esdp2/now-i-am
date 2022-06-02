import { NgModule } from '@angular/core';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { usersReducer } from './store/users/users.reducer';
import { UsersEffects } from './store/users/users.effects';
import { localStorageSync } from 'ngrx-store-localstorage';
import { postsReducer } from './store/posts/posts.reducer';
import { PostsEffects } from './store/posts/posts.effects';
import { searchReducer } from './store/search/search.reducer';
import { SearchEffects } from './store/search/search.effects';
import { ChatEffects } from './store/chat/chat.effects';
import { chatReducer } from './store/chat/chat.reducer';
import { CountriesReducer } from './store/countries/countries.reducer';
import { CountriesEffects } from './store/countries/countries.effects';

const localStorageSyncReducer = (reducer: ActionReducer<any>) => {
  return localStorageSync({
    keys: [{users: ['user']}],
    rehydrate: true,
  })(reducer);
};

const metaReducers: MetaReducer[] = [localStorageSyncReducer];

const reducers = {
  users: usersReducer,
  search: searchReducer,
  posts: postsReducer,
  chat: chatReducer,
  countries: CountriesReducer,
};

const effects = [
  UsersEffects,
  SearchEffects,
  UsersEffects,
  PostsEffects,
  ChatEffects,
  CountriesEffects,
];

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, {metaReducers}),
    EffectsModule.forRoot(effects),
  ],
  exports: [StoreModule, EffectsModule]
})
export class AppStoreModule { }
