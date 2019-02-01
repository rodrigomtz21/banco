import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

import {ModelCreateAccount} from '../modelcreateaccount';
@Component({
  /*selector: 'app-accounts',*/
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  account = new ModelCreateAccount("", "", "");

  closeResult: string;
  success_message:string = "";
  closed = true;

  modalReference = null;
  accounts = [];
  cards = [];
  /**************Headers of table accounts*******************/
  headers_accounts = [{
    name: '_id',
    title: 'ID'
  },{
    name: 'name',
    title: 'Name'
  },{
    name: 'type',
    title: 'Type'
  },{
    name: 'userId',
    title: 'Id user'
  },{
    name: 'deposits',
    title: 'Deposits'
  },{
    name: 'withdrawals',
    title: 'Withdrawals'
  },{
    name: 'balance',
    title: 'Balance'
  }]
  constructor(private http: HttpClient, private router: Router, private modalService: NgbModal, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    /**************Spinner starts***********************/
    this.spinner.show();
    setTimeout(() => {
        this.spinner.hide();
    }, 1500);
    /**********Get token and userId**********************/
    const helper = new JwtHelperService();
    const token: string = localStorage.getItem('token');
    this.account.userId = localStorage.getItem('userId');

    if(token == null && helper.isTokenExpired(token)){
      this.router.navigate(['/']);
    }
    //console.log(token);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-access-token': token
    });

    this.http.get('https://mighty-refuge-81707.herokuapp.com/api/accounts',{
      headers
    }).subscribe(data => {
      console.log(data['response']);
      this.accounts = data['response'];
    });
    this.http.get('https://mighty-refuge-81707.herokuapp.com/api/catalogs/cards',{
      headers
    }).subscribe(data => {
      //console.log(data['response']['type_cards']);
      this.cards = data['response']['type_cards'];
    });
  }

  /**************Modal methods********************/
  open(content) {
    this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  saveAccount (){
    for (let card of this.cards) {
			if(card.type == this.account.type) {
				this.account.name = card.name;
			}
		}

    const token: string = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-access-token': token
    });
    console.log(this.account);
    this.http.post('https://mighty-refuge-81707.herokuapp.com/api/accounts',this.account,{
        headers,
    }).subscribe(res => {
      this.closed = false;
      this.success_message = res['success'];
      this.account.type = "";
      this.account.name = "";
    });
    this.modalReference.close();
  }

}
