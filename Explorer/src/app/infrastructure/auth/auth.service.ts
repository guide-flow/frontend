import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, switchMap, catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenStorage } from './jwt/token.service';
import { environment } from 'src/env/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Login } from './model/login.model';
import { AuthenticationResponse } from './model/authentication-response.model';
import { User } from './model/user.model';
import { Registration } from './model/registration.model';
import { RegistrationResponse } from './model/registration-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<User>({ email: '', id: 0, role: '' });

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorage,
    private router: Router
  ) {}

  login(login: Login): Observable<AuthenticationResponse> {
    return this.http
      .post<AuthenticationResponse>(
        environment.gatewayHost + 'api/authentication/authenticate',
        login
      )
      .pipe(
        tap((authenticationResponse) => {
          this.tokenStorage.saveAccessToken(authenticationResponse.accessToken);
          this.setUser();
          console.log(this.user$);
        }),
        switchMap((authenticationResponse) => {
          // Check if user has a profile
          return this.checkUserProfile().pipe(
            tap((hasProfile) => {
              const userId = this.user$.value.id;
              if (!hasProfile && userId) {
                // First login - redirect to profile creation
                this.router.navigate(['/user-profile', userId]);
              } else {
                // Has profile - redirect to home
                this.router.navigate(['/']);
              }
            }),
            switchMap(() => of(authenticationResponse))
          );
        })
      );
  }

  private checkUserProfile(): Observable<boolean> {
    return this.http
      .get(environment.gatewayHost + 'api/user-profiles/user-profile')
      .pipe(
        switchMap(() => of(true)),
        catchError((error) => {
          // If 404 or any error, assume no profile exists
          console.log('No profile found, first login detected');
          return of(false);
        })
      );
  }

  register(registration: Registration): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(
      environment.gatewayHost + 'api/authentication/register',
      registration
    );
  }

  logout(): void {
    this.router.navigate(['/home']).then((_) => {
      this.tokenStorage.clear();
      this.user$.next({ email: '', id: 0, role: '' });
    });
  }

  checkIfUserExists(): void {
    const accessToken = this.tokenStorage.getAccessToken();
    if (accessToken == null) {
      return;
    }
    this.setUser();
  }

  private setUser(): void {
    const jwtHelperService = new JwtHelperService();
    const accessToken = this.tokenStorage.getAccessToken() || '';
    const user: User = {
      id: +jwtHelperService.decodeToken(accessToken).sub,
      email: jwtHelperService.decodeToken(accessToken).email,
      role: jwtHelperService.decodeToken(accessToken).role,
    };
    this.user$.next(user);
  }
}
