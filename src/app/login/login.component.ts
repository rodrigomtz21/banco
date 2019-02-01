import { Component, OnInit } from '@angular/core';
import {ModelLoginUser} from '../modelloginuser';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  /*selector: 'app-login',*/
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user = new ModelLoginUser("", "");
  userForm;
  loginError:boolean = false;

  constructor(private http: HttpClient, private router: Router, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    /**************Spinner starts***********************/
    this.spinner.show();
    setTimeout(() => {
        this.spinner.hide();
    }, 1500);
    /**************Form validation**********************/
    this.userForm = new FormGroup({
      'email': new FormControl(this.user.email, [
        Validators.required,
        Validators.email,
        Validators.minLength(4)
      ]),
      'password': new FormControl(this.user.password, [
        Validators.required,
        Validators.minLength(4),
      ])
    });
  }
  get email() { return this.userForm.get('email'); }
  get password() { return this.userForm.get('password'); }
  login() {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    //return new Promise((resolve, reject) => {
        this.http.post('https://mighty-refuge-81707.herokuapp.com/api/auth/user/authenticate',this.user,{
                headers,
            }).subscribe(res => {
                //console.log(res);
                const helper = new JwtHelperService();
                const decodedToken = helper.decodeToken(res['token']);
                //console.log(decodedToken);
                localStorage.setItem('token', res['token']);
                localStorage.setItem('userId', decodedToken.id);

                this.router.navigate(['/accounts']);
            },
            error => {
                console.log(error);
                this.loginError = true;
            }
        );
    //})

  }
  logout() {
    localStorage.removeItem('token');
  }
}
