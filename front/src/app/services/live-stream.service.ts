import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LiveStreamService {
  private connections: { [id: string]: RTCPeerConnection } = {};

  onCreateCandidate = new Subject<{ id: string, candidate: RTCIceCandidate }>();

  private async initWebRTCConnection(connectionId: string) {
    const connection = new RTCPeerConnection( {
      iceServers: [
        {
          urls: [
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
          ],
        },
      ],
    });

    connection.onicecandidate = (event) => {
      if (event.candidate) {
        this.onCreateCandidate.next({ id: connectionId, candidate: event.candidate });
      }
    };

    this.connections[connectionId] = connection;
    return connection;
  }

  async createOffer(connectionId: string, mediaStream: MediaStream) {
    const connection = await this.initWebRTCConnection(connectionId);

    mediaStream.getTracks().forEach((track) => {
      connection.addTrack(track, mediaStream);
    });

    const offer = await connection.createOffer();
    await connection.setLocalDescription(offer);

    return { connection, offer };
  }

  async handleOffer(connectionId: string, offer: RTCSessionDescription, videoStream: MediaStream) {
    const connection = await this.initWebRTCConnection(connectionId);

    connection.ontrack = (event) => {
      videoStream.addTrack(event.track);
    };

    await connection.setRemoteDescription(offer);

    const answer = await connection.createAnswer();
    await connection.setLocalDescription(answer);

    return { connection, answer };
  }

  async handleAnswer(connectionId: string, answer: RTCSessionDescription) {
    const connection = this.connections[connectionId];
    if (!connection) {
      return;
    }

    await connection.setRemoteDescription(answer);
  }

  async handleCandidate(connectionId: string, candidate: RTCIceCandidate) {
    const connection = this.connections[connectionId];
    if (!connection) {
      return;
    }

    await connection.addIceCandidate(candidate);
  }
}
