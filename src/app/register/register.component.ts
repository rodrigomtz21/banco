import { Component, OnInit } from '@angular/core';
import {ModelRegisterUser} from '../modelregisteruser';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
@Component({
  /*selector: 'app-register',*/
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user = new ModelRegisterUser("", "", "", "");
  userForm;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    /**************Form validation**********************/
    this.userForm = new FormGroup({
      'email': new FormControl(this.user.email, [
        Validators.required,
        Validators.email,
        Validators.minLength(4)
      ]),
      'firstname': new FormControl(this.user.firstname, Validators.required),
      'lastname': new FormControl(this.user.lastname, Validators.required),
      'password': new FormControl(this.user.password, [
        Validators.required,
        Validators.minLength(4),
      ])
    });
  }

  get email() { return this.userForm.get('email'); }
  get firstname() { return this.userForm.get('firstname'); }
  get lastname() { return this.userForm.get('lastname'); }
  get password() { return this.userForm.get('password'); }

  registerUser(){
    /*****************Register User*********************/
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
  	this.http.post('https://mighty-refuge-81707.herokuapp.com/api/auth/user/create', this.user,{
  	    headers,
  	}).subscribe(data => {
          console.log(data);
          this.user.email = "";
          this.user.firstname = "";
          this.user.lastname = "";
          this.user.password = "";
  	});
  }
}
