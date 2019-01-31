import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  status_login:boolean = false;
  constructor(private router: Router) { }

  ngOnInit() {
    const token: string = localStorage.getItem('token');
    if(token != null){
      this.status_login = true;
    }
  }
  logout() {
      localStorage.removeItem('token');
      this.router.navigate(['/']);
  }
}
