import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LiveStreamService } from '../../services/live-stream.service';
import { WebsocketMessage, WebsocketService } from '../../services/websocket.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { User } from '../../models/user.model';
import { HelpersService } from '../../services/helpers.service';

@Component({
  selector: 'app-live-stream',
  templateUrl: './live-stream.component.html',
  styleUrls: ['./live-stream.component.sass']
})
export class LiveStreamComponent implements OnInit, OnDestroy {
  @ViewChild('stream') streamElement!: ElementRef<HTMLElement>;
  @ViewChild('remoteVideo') set content(content: ElementRef) {
    this.videoElement = content;
    this.onVideoElementVisible();
  }

  user: Observable<null | User>;
  userData: null | User = null;

  videoElement?: ElementRef<HTMLVideoElement>;
  videoStream?: MediaStream;

  isStreamOnline = false;
  isStreamAuthor = false;

  liveStreamId = '';
  liveStreamConnection?: RTCPeerConnection;

  streamStartedOn: number = 0;
  streamDuration: number = 0;
  calculateStreamDurationInterval: number = 0;
  streamConnections: { [key: string]: RTCPeerConnection } = {};

  isPermissionsAllowed = false;

  userSub!: Subscription;
  streamCandidateSub!: Subscription;
  websocketCloseSub!: Subscription;
  websocketConnectSub!: Subscription;
  websocketOfferSub!: Subscription;
  websocketAnswerSub!: Subscription;
  websocketCandidateSub!: Subscription;
  websocketDisconnectSub!: Subscription;
  routeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private helpersService: HelpersService,
    private liveStreamService: LiveStreamService,
    private websocketService: WebsocketService,
  ) {
    this.user = store.select((user) => user.users.user);
  }

  ngOnInit(): void {
    this.streamCandidateSub = this.liveStreamService.onCreateCandidate.subscribe((candidate) => {
      this.websocketService.send({ type: 'LIVE_STREAM_CANDIDATE', id: this.userData?._id, user: candidate.id, candidate: candidate.candidate });
    });

    this.websocketCloseSub = this.websocketService.onEvent('LIVE_STREAM_CLOSE').subscribe(() => {
      this.isStreamOnline = false;
      this.liveStreamConnection?.close();
    });
    this.websocketConnectSub = this.websocketService.onEvent<WebRTCMessage>('LIVE_STREAM_CONNECT').subscribe(async ({ message }) => {
      if (!this.videoStream) {
        return;
      }

      const offer = await this.liveStreamService.createOffer(message.user, this.videoStream);
      this.streamConnections[message.user] = offer.connection;

      this.websocketService.send({ type: 'LIVE_STREAM_OFFER', id: message.id, user: message.user, offer: offer.offer });
    });
    this.websocketOfferSub = this.websocketService.onEvent<WebRTCOfferMessage>('LIVE_STREAM_OFFER').subscribe(async ({ message }) => {
      if (!this.videoStream) {
        return;
      }

      const answer = await this.liveStreamService.handleOffer(message.user, message.offer, this.videoStream);
      this.liveStreamConnection = answer.connection;

      this.websocketService.send({ type: 'LIVE_STREAM_ANSWER', id: message.id, user: message.user, answer: answer.answer });

      this.showStreamVideo();
    });
    this.websocketAnswerSub = this.websocketService.onEvent<WebRTCAnswerMessage>('LIVE_STREAM_ANSWER').subscribe(({ message }) => {
      void this.liveStreamService.handleAnswer(message.user, message.answer);
    });
    this.websocketCandidateSub = this.websocketService.onEvent<WebRTCCandidateMessage>('LIVE_STREAM_CANDIDATE').subscribe(({ message }) => {
      void this.liveStreamService.handleCandidate(message.user, message.candidate);
    });
    this.websocketDisconnectSub = this.websocketService.onEvent<WebRTCMessage>('LIVE_STREAM_DISCONNECT').subscribe(({message}) => {
      const connection = this.streamConnections[message.user];
      if (!connection) {
        return;
      }

      connection.close();
      delete this.streamConnections[message.user];
    });

    this.routeSub = this.route.params.subscribe((param) => {
      if (!param['id']) {
        this.isStreamAuthor = true;
        return;
      }

      this.isStreamAuthor = false;
      this.liveStreamId = param['id'];
      this.connectToStream();
    });
    this.userSub = this.user.subscribe((user) => {
      this.userData = user;
      this.connectToStream();
    });
  }

  onVideoElementVisible() {
    if (!this.isStreamAuthor) {
      this.videoStream = new MediaStream();
    }

    if (!this.videoElement || !this.videoStream) {
      return;
    }

    if (this.isStreamAuthor) {
      this.videoElement.nativeElement.muted = true;
    }

    this.videoElement.nativeElement.srcObject = this.videoStream;
    void this.videoElement.nativeElement.play();
  }

  showStreamVideo() {
    setTimeout(() => {
      this.streamElement.nativeElement.classList.add('visible');
    }, 100);
  }

  async getMediaPermissions() {
    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
    } catch(e) {
      this.helpersService.openSnackBar('Доступ к камере и микрофону запрещены. Невозможно создать трансляцию.');
      return;
    }

    this.isPermissionsAllowed = true;
    this.showStreamVideo();

    this.createStream();
  }

  createStream() {
    this.isStreamOnline = true;
    this.streamStartedOn = Date.now();

    this.streamDuration = Date.now() - this.streamStartedOn;
    this.calculateStreamDurationInterval = setInterval(() => {
      this.streamDuration = Date.now() - this.streamStartedOn;
    }, 1000);

    this.websocketService.send({ type: 'LIVE_STREAM_CREATE' });
  }

  closeStream() {
    this.isStreamOnline = false;
    clearInterval(this.calculateStreamDurationInterval);

    const connectionKeys = Object.keys(this.streamConnections);
    connectionKeys.forEach((connectionKey) => {
      const connection = this.streamConnections[connectionKey];

      connection.close();
      delete this.streamConnections[connectionKey];
    });

    this.websocketService.send({ type: 'LIVE_STREAM_CLOSE' });
  }

  connectToStream() {
    if (!this.liveStreamId || !this.userData || this.isStreamOnline) {
      return;
    }

    this.isStreamOnline = true;
    this.websocketService.send({ type: 'LIVE_STREAM_CONNECT', id: this.liveStreamId, user: this.userData?._id });
  }

  disconnectFromStream() {
    if (!this.liveStreamId || !this.userData || !this.isStreamOnline) {
      return;
    }

    this.liveStreamConnection?.close();

    this.isStreamOnline = false;
    this.websocketService.send({ type: 'LIVE_STREAM_DISCONNECT', id: this.liveStreamId, user: this.userData?._id });
  }

  ngOnDestroy(): void {
    this.closeStream();

    this.userSub.unsubscribe();
    this.streamCandidateSub.unsubscribe();
    this.websocketCloseSub.unsubscribe();
    this.websocketConnectSub.unsubscribe();
    this.websocketOfferSub.unsubscribe();
    this.websocketAnswerSub.unsubscribe();
    this.websocketCandidateSub.unsubscribe();
    this.websocketDisconnectSub.unsubscribe();
    this.routeSub.unsubscribe();
  }
}

interface WebRTCMessage extends WebsocketMessage {
  id: string;
  user: string;
}

interface WebRTCOfferMessage extends WebRTCMessage {
  type: string;
  offer: RTCSessionDescription;
}

interface WebRTCAnswerMessage extends WebRTCMessage {
  type: string;
  answer: RTCSessionDescription;
}

interface WebRTCCandidateMessage extends WebRTCMessage {
  type: string;
  candidate: RTCIceCandidate;
}
