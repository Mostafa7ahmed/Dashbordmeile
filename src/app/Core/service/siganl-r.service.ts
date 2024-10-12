import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SiganlRService {

  constructor() { }

  private hubConnection!: signalR.HubConnection;
    public startConnection(): void {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('https://meilisync.runasp.net/fast-meili-sync-hub', { withCredentials: false }) 
        .build();
  
      this.hubConnection
        .start()
        .then(() => console.log('SignalR connection started'))
        .catch(err => console.log('Error while starting SignalR connection: ' + err));
    }
  
    // Add a listener for notifications from SignalR
    public addListener(nameConnection:string ,onNotify: (operationType: number, data: any) => void): void {
      this.hubConnection.on(nameConnection, (operationType, data) => {
        console.log('Data NotifyMeiliSearchAsync:', data);
        console.log('operationType NotifyMeiliSearchAsync:', operationType);
        onNotify(operationType, data); 
      });
    }
  
    public stopConnection(): void {
      if (this.hubConnection) {
        this.hubConnection.stop().then(() => console.log('SignalR connection stopped'));
      }
    }

}
