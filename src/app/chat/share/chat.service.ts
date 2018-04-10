import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { domain } from '../../config';

@Injectable()
export class ChatService {
  constructor(private http: HttpClient) {
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log('An error occurred: ', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + 
        `body was: ${error.error}`
      );
    }

    return Observable.throw(
      'Something bad happened; please try again later.'
    );
  }

  public login(appKey: string, username: string) {
    return this.http.get(`${domain}/getContactInfo`, {
        params: { appKey, username },
      })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }
}
