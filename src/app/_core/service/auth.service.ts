import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment.prod';
import {SignupRequestPayload} from '../request/signupRequest.payload';
import {SigninRequestPayload} from '../request/signinRequest.payload';

// @ts-ignore
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    // Accept: 'application/json',
    // 'Access-Control-Allow-Origin': 'http://localhost:4200',
    // 'Access-Control-Allow-Credentials': 'true'
  })
};

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  // API SERVER
  private API_SIGNUP = environment.API_SERVER + 'signup';
  private API_SIGNIN = environment.API_SERVER + 'signin';

  constructor(private http: HttpClient) {
  }

  signup(signup: SignupRequestPayload): Observable<any> {
    return this.http.post(this.API_SIGNUP, signup, httpOptions).pipe(
      tap((data: any) => {
      }),
      catchError(err => {
        return this.HandleErr(err);
      })
    );
  }

  signin(signin: SigninRequestPayload): Observable<any> {
    return this.http.post(this.API_SIGNIN, signin, httpOptions).pipe(
      tap((data: any) => {
      }),
      catchError(err => {
        return this.HandleErr(err);
      })
    );
  }

  HandleErr(err) {
    console.log(err);
    switch (err.status) {
      case 500:
        console.log(err.Error);
        break;

      default:
        break;
    }
    return throwError(err);
  }
}
