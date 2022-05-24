import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private readonly websocket!: WebSocket;
  private eventCallbacks: { [key: string]: Subscriber<{ ws: WebSocket, message: WebsocketMessage }>[] } = {};

  constructor() {
    this.websocket = new WebSocket(env.webSocketUrl);
    this.websocket.onmessage = (event) => this.onWebsocketMessage(event);
    this.websocket.onclose = () => this.onWebsocketClose();
  }

  get ws() {
    return this.websocket;
  }

  initialize() {
    return new Promise<boolean>((resolve) => resolve(true));
  }

  onEvent(type: string) {
    return new Observable<{ws: WebSocket, message: WebsocketMessage}>((subscriber) => {
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

  sendMessage(data: WebsocketMessage) {
    const jsonData = JSON.stringify(data);
    this.websocket.send(jsonData);
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
        subscriber.next({ws: this.websocket, message: decodedMessage});
      });
    } catch(e) {}
  }

  private onWebsocketClose() {
    const getCallbacks = this.eventCallbacks['close'];
    if (!getCallbacks) {
      return;
    }

    getCallbacks.forEach((subscriber) => {
      subscriber.next({ws: this.websocket, message: { type: 'close' }});
    });
  }
}

export interface WebsocketMessage {
  [key: string]: any;
  type: string;
}
