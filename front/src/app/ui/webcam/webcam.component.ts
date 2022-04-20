import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { WebcamImage } from 'ngx-webcam';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.sass']
})
export class WebcamComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<ModalWindowComponent>,
              private postsService: PostsService,
              ) {}

  ngOnInit(): void {
  }

  public webcamImage:  WebcamImage | null = null;
  private trigger: Subject<void> = new Subject<void>();

  triggerSnapshot(): void {
    this.trigger.next();
  }

  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  takePictureAgain() {
    this.webcamImage = null;
  }

  savePicture() {
    this.postsService.getImageUrl64(this.webcamImage);
    this.dialogRef.close();
  }

}
