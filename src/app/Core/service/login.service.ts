import { environment } from './../../../Environment/environment';
import { Injectable } from '@angular/core';
import { SignIn } from '../interface/sign-in';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _HttpClient:HttpClient) { }
  Signin(user: SignIn):Observable<any>{
    return this._HttpClient.put(`${environment.baseUrl}${environment.loginRoute}`,user,{
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }


}
