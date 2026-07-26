import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Subject, timer, Subscription, EMPTY } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';

//Die Arten der Nachrichten, die über den WebSocket gesendet werden können
export interface SocketFilm {
  type: 'like' | 'kommentar' | 'aufrufe' | 'system';
  payload: any;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$!: WebSocketSubject<SocketFilm>;
  private filmSubject$ = new Subject<SocketFilm>();

  // Das Observable das abonniert werden kann
  public film$ = this.filmSubject$.asObservable();

  private socketEndpoint = 'ws://localhost:4000';
  private connectionSubscription!: Subscription;

  public connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();

      this.connectionSubscription = this.socket$.pipe(
        tap({
          error: error => console.error('WebSocket connection error:', error),
          complete: () => console.warn('WebSocket connection closed')
        }),
        retry({ count: 10, delay: (error, retryCount) => timer(3000) }),
        catchError(error => {
          console.error('WebSocket failed after 10 retries', error);
          return EMPTY;
        })
      ).subscribe((msg: SocketFilm) => {
        this.filmSubject$.next(msg);
      });
    }
  }

  private getNewWebSocket(): WebSocketSubject<SocketFilm> {
    return webSocket({
      url: this.socketEndpoint,
      openObserver: {
        next: () => console.log('[WebSocket] Connected')
      },
      closeObserver: {
        next: () => console.log('[WebSocket] Disconnected')
      }
    });
  }

  public sendUpdate(msg: SocketFilm): void {
    if (this.socket$ && !this.socket$.closed) {
      this.socket$.next(msg);
    } else {
      console.error('Cannot send message: WebSocket is disconnected.');
    }
  }

}
