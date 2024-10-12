import { HttpClient } from '@angular/common/http';
import { GlobalAPiService } from './global-api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { GenericService } from './generic.service';
import { environment } from '../../../Environment/environment';
import { Meilisearch } from '../interface/meilisearch';

@Injectable({
  providedIn: 'root'
})
export class MeilisearchService {
  private hubConnection!: signalR.HubConnection;

  private MelieUrl: string;

  constructor( private http: HttpClient) {
    this.MelieUrl = `${environment.baseUrl}${environment.meilisearchRoute}`;
  }

  getAll(numpage: number = 1, pageSize: number = 10 ,search:string): Observable<any> {
    return new GenericService<Meilisearch>(this.http).getAll(this.MelieUrl, numpage, pageSize, search);
  }

  getMelieById(MelieId: string): Observable<any> {
    return new GenericService<Meilisearch>(this.http).getById(this.MelieUrl, MelieId);
  }

  deleteMelie(MelieId: string): Observable<any> {
    return new GenericService<Meilisearch>(this.http).delete(this.MelieUrl, MelieId);
  }

  addMelie(dataMelie: any): Observable<any> {
    return new GenericService<Meilisearch>(this.http).add(this.MelieUrl, dataMelie);
  }

  updateMelie(dataMelie: any): Observable<any> {
    return new GenericService<Meilisearch>(this.http).update(this.MelieUrl, dataMelie);
  }


}
