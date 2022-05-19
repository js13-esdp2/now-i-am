import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { ApiPostData, Post, PostData } from '../models/post.model';
import { Subject } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  public imageData64 = new Subject<WebcamImage>();
  post!: Post;
  postModalChange = new Subject<Post>();

  constructor(private http: HttpClient) {
  }

  getPosts(filterData: any) {
    let params = new HttpParams();
    if (filterData?.title) params = params.append('title', filterData.title);
    if (filterData?.birthday) params = params.append('birthday', filterData.birthday);
    if (filterData?.sex) params = params.append('sex', filterData.sex);
    if (filterData?.country) params = params.append('country', filterData.country);
    if (filterData?.city) params = params.append('city', filterData.city);
    if (filterData?.isPrivate) params = params.append('isPrivate', filterData.isPrivate);
    return this.http.get<ApiPostData[]>(environment.apiUrl + '/posts', {params}).pipe(
      map(response => {
        return response.map(postData => {
          return new Post(
            postData._id,
            postData.user,
            postData.title,
            postData.content,
            postData.datetime,
            postData.time,
            postData.likes,
            postData.geolocation,
          );
        });
      })
    );
  }

  getPost(id: string) {
    return this.http.get<Post>(environment.apiUrl + `/posts/${id}`).pipe(
      map(result => {
        return result
      })
    );
  }

  createPost(postData: PostData) {
    const formData = new FormData();

    Object.keys(postData).forEach(key => {
      if (postData[key] !== null) {
        if (key !== 'time') {
          formData.append(key, postData[key]);
        } else {
          formData.append(key, JSON.stringify(postData[key]));
        }
      }
    });

    return this.http.post(environment.apiUrl + '/posts', formData);
  }

  removePost(id: string) {
    return this.http.delete(environment.apiUrl + `/posts/${id}`);
  }

  getImageUrl64(imageUrl64: WebcamImage | null) {
    this.imageData64.next(imageUrl64!);
  }

  likePost(id: string) {
    return this.http.post<Post>(environment.apiUrl + '/posts/' + id + '/like', {}).pipe(
      map((postData) => {
        return new Post(
          postData._id,
          postData.user,
          postData.title,
          postData.content,
          postData.datetime,
          postData.time,
          postData.likes,
          postData.geolocation,
        );
      }),
    );
  }

  getMyHistoryPosts(user_id: string) {
    return this.http.get<ApiPostData[]>(environment.apiUrl + `/posts/my-history-posts/${user_id}`).pipe(
      map(response => {
        return response.map(postData => {
          return new Post(
            postData._id,
            postData.user,
            postData.title,
            postData.content,
            postData.datetime,
            postData.time,
            postData.likes,
            postData.geolocation,
          );
        });
      })
    );
  }

}

