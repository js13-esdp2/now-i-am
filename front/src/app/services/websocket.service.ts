import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService extends WebSocket {
  private eventCallbacks: { [key: string]: Subscriber<{ ws: WebSocket, message: any }>[] } = {};
  private sendMessagesQueue: string[] = [];
  private userId = '';

  constructor() {
    super(env.webSocketUrl);
    this.onopen = () => this.onWebsocketOpen();
    this.onclose = () => this.onWebsocketClose();
    this.onmessage = (event) => this.onWebsocketMessage(event);
  }

  override send(data: string | ArrayBufferLike | Blob | ArrayBufferView | WebsocketMessage) {
    if (typeof data === 'object') {
      data = JSON.stringify(data);
    }

    if (this.readyState === this.CONNECTING) {
      this.sendMessagesQueue.push(data);
      return;
    }

    super.send(data);
  }

  private onWebsocketOpen() {
    const messagesQueueLength = this.sendMessagesQueue.length;
    if (!messagesQueueLength) {
      return;
    }

    for (let i = 0; i < messagesQueueLength; i++) {
      const message = this.sendMessagesQueue.splice(0, 1)[0];
      this.send(message);
    }
  }

  private onWebsocketClose() {
    const getCallbacks = this.eventCallbacks['close'];
    if (!getCallbacks) {
      return;
    }

    getCallbacks.forEach((subscriber) => {
      subscriber.next({ws: this, message: { type: 'close' }});
    });
  }

  initialize() {
    return new Promise<boolean>((resolve) => resolve(true));
  }

  userConnect(userId: string) {
    if (this.userId === userId) {
      return;
    }

    this.userId = userId;
    this.send({ type: 'AUTH', userId: userId });
  }

  userDisconnect() {
    if (this.userId) {
      this.send({ type: 'LOGOUT', userId: this.userId });
    }
  }

  onEvent<MessageType extends WebsocketMessage>(type: string) {
    return new Observable<{ws: WebSocket, message: MessageType}>((subscriber) => {
      let eventCallbacks = this.eventCallbacks;

      if (this.eventCallbacks[type]) {
        eventCallbacks[type].push(subscriber);
      } else {
        eventCallbacks[type] = [subscriber];
      }

      return {
        unsubscribe() {
          const index = eventCallbacks[type].findIndex((s) => s === subscriber);
          if (index !== -1) {
            eventCallbacks[type].splice(index, 1);
          }
        },
      };
    });
  }

  private onWebsocketMessage(event: MessageEvent) {
    try {
      const decodedMessage = <WebsocketMessage>JSON.parse(event.data);
      const messageType = decodedMessage.type;

      const getCallbacks = this.eventCallbacks[messageType];
      if (!getCallbacks) {
        return;
      }

      getCallbacks.forEach((subscriber) => {
        subscriber.next({ws: this, message: decodedMessage});
      });
    } catch(e) {}
  }
}

export interface WebsocketMessage {
  [key: string]: any;
  type: string;
}
