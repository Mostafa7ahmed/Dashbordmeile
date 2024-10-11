import { HttpClient } from '@angular/common/http';
import { GlobalAPiService } from './global-api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class MeilisearchService {
  private hubConnection!: signalR.HubConnection;

  constructor(private Url: GlobalAPiService, private _HttpClient: HttpClient) { }

  getAll(numpage: number = 1, pageSize: number = 50): Observable<any> {
    return this._HttpClient.get(`${this.Url.baseUrl}${this.Url.meilisearchRoute}/paginate?pageNumber=${numpage}&pageSize=${pageSize}`);
  }

  getMeileById(melieId: string): Observable<any> {
    return this._HttpClient.get(`${this.Url.baseUrl}${this.Url.meilisearchRoute}?id=${melieId}`);
  }

  deleteMeile(melieId: string): Observable<any> {
    return this._HttpClient.delete(`${this.Url.baseUrl}${this.Url.meilisearchRoute}?id=${melieId}`);
  }

 addMeile(datamelie: any): Observable<any> {
    return this._HttpClient.post(`${this.Url.baseUrl}${this.Url.meilisearchRoute}`, datamelie);
  }

  updateMelie(datamelie: any): Observable<any> {
    return this._HttpClient.put(`${this.Url.baseUrl}${this.Url.meilisearchRoute}`, datamelie, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // SignalR methods

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
  public addTransferDataListener(onNotify: (operationType: number, data: any) => void): void {
    this.hubConnection.on('NotifyMeiliSearchAsync', (operationType, data) => {
      console.log('Data NotifyMeiliSearchAsync:', data);
      console.log('operationType NotifyMeiliSearchAsync:', operationType);
      onNotify(operationType, data); // Pass the data to the provided callback
    });
  }

  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop().then(() => console.log('SignalR connection stopped'));
    }
  }
}
