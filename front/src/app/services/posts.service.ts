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

  constructor(private http: HttpClient) { }

  getPosts(userId?: string, title?: string) {
    let params = new HttpParams();
    if (userId) params = params.append('user', userId);
    if (title) params = params.append('title', title);

    return this.http.get<ApiPostData[]>(environment.apiUrl + '/posts', { params }).pipe(
      map(response => {
        return response.map(postData => {
          return new Post(
            postData._id,
            postData.user,
            postData.title,
            postData.content,
            postData.datetime,
            postData.time
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

  createPost(postData: PostData){
    const formData = new FormData();

    Object.keys(postData).forEach(key => {
      if (postData[key] !== null){
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
    return this.http.delete<ApiPostData[]>(environment.apiUrl + `/posts/${id}`).pipe(
      map(response => {
        return response.map(postData => {
          return new Post(
            postData._id,
            postData.user,
            postData.title,
            postData.content,
            postData.datetime,
            postData.time
          );
        });
      })
    );
  }

  getImageUrl64(imageUrl64: WebcamImage | null) {
    this.imageData64.next(imageUrl64!);
  }
}

