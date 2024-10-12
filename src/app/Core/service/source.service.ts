import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericService } from './generic.service';
import { GlobalAPiService } from './global-api.service';
import { environment } from '../../../Environment/environment';
import { Source } from '../interface/source';

@Injectable({
  providedIn: 'root'
})
export class SourceService {
  private sourceUrl: string;

  constructor(private http: HttpClient) {
    this.sourceUrl = `${environment.baseUrl}${environment.sourceRoute}`;
  }

  getAll(numpage: number = 1, pageSize: number = 10 , serch:string=""): Observable<any> {
    return new GenericService<Source>(this.http).getAll(this.sourceUrl, numpage, pageSize , serch);
  }
  getSourceById(SourceId: string): Observable<any> {
    return new GenericService<Source>(this.http).getById(this.sourceUrl, SourceId);
  }
  deleteSource(SourceId: string): Observable<any> {
    return new GenericService<Source>(this.http).delete(this.sourceUrl, SourceId);
  }

  addSource(dataSource: any): Observable<any> {
    return new GenericService<Source>(this.http).add(this.sourceUrl, dataSource);
  }

  updateSource(dataSource: any): Observable<any> {
    return new GenericService<Source>(this.http).update(this.sourceUrl, dataSource);
  }
}
