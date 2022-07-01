import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { ApiPostData, Post, PostData } from '../models/post.model';
import { Comment, CommentData } from '../models/comment.model';
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

  getSecondsToHms(secondsUnix: string){
    const unixTime = (Math.round(new Date().getTime() / 1000));
    const time = Number(secondsUnix);
    let resSeconds = time - unixTime;
    let action = 'осталось'
    if(resSeconds < 0) {
      action = 'прошло'
      resSeconds = (Math.abs(resSeconds));
    }
      const d = Math.floor(resSeconds / (3600*24));
      const h = Math.floor(resSeconds / 3600);
      const m = Math.floor(resSeconds % 3600 / 60);
      const dDisplay = d > 0 ? d + (d == 1 ? " д " : " д ") : "";
      const hDisplay = h > 0 ? h + (h == 1 ? " ч " : " ч ") : "";
      const mDisplay = m > 0 ? m + (m == 1 ? " мин " : " мин ") : "";
      return dDisplay + hDisplay + mDisplay + action;
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
          let lastTime = this.getSecondsToHms(postData.invisibleAtUnixTime);
          return new Post(
            postData._id,
            postData.user,
            postData.title,
            postData.content,
            postData.datetime,
            postData.time,
            postData.likes,
            postData.geolocation,
            postData.comments,
            lastTime
          )
        }).reverse();
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
          postData.comments,
          postData.invisibleAtUnixTime
        );
      }),
    );
  }

  getMyHistoryPosts(user_id: string) {
    return this.http.get<ApiPostData[]>(environment.apiUrl + `/posts/my-history-posts/${user_id}`).pipe(
      map(response => {
        return response.map(postData => {
          let lastTime = this.getSecondsToHms(postData.invisibleAtUnixTime);
          return new Post(
            postData._id,
            postData.user,
            postData.title,
            postData.content,
            postData.datetime,
            postData.time,
            postData.likes,
            postData.geolocation,
            postData.comments,
            lastTime
          );
        }).reverse();
      })
    );
  }


  getComments(postId: string) {
    return this.http.get<Comment[]>(environment.apiUrl + `/comments/${postId}`).pipe(
      map(response => {
        return response.map(commentData => {
          return new Comment(
            commentData._id,
            commentData.user,
            commentData.text,
            commentData.postId,
          )
        });
      })
    );
  }


  createComment(comment: CommentData) {
    return this.http.post<Comment[]>(environment.apiUrl + '/comments', comment).pipe(
      map(response => {
        return response.map(commentData => {
          return new Comment(
            commentData._id,
            commentData.user,
            commentData.text,
            commentData.postId,
          )
        });
      })
    );
  }

  removeComment(commentId: string) {
    return this.http.delete(environment.apiUrl + `/comments/${commentId}`);
  }

}

