
import { LoginService } from './../../Core/service/login.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  isloading :boolean =false;
  constructor(private _loginService:LoginService){}
  siginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [
      Validators.required,
      Validators.email 
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.min(2),
    ]),

  });

  Sigin(formInfo: FormGroup) {
 
    this.isloading=true;
    
    this._loginService.Signin(formInfo.value).subscribe((res) => {
      if (res.success) {
        this.isloading=false;
        localStorage.setItem("TokenMelie", res.result.token);
        localStorage.setItem("userId", res.result.userId);
        console.log(res.message)




        
      } 
    },
      (error) => {
        this.isloading=false;
       
    })
   
  }

}
