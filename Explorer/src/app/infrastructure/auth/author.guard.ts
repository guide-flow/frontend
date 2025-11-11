import { Injectable } from '@angular/core';
import {
  CanActivate,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from './model/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthorGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    const user: User = this.authService.user$.getValue();

    // Check if user is logged in
    if (user.email === '') {
      this.router.navigate(['login']);
      return false;
    }

    // Check if user has Author role
    if (user.role !== 'Author') {
      alert('Access denied. Only Authors can manage tours.');
      this.router.navigate(['home']);
      return false;
    }

    return true;
  }
}
