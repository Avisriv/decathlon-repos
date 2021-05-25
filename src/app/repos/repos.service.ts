import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReposService {
  apiParameter = '';

  constructor(private httpClient: HttpClient) {}

  getDatas() {
    const headers = {
      'Authorization': environment.token
    };
    return this.httpClient
      .get<{}>('https://api.github.com/users/Decathlon/repos', {headers})
      .pipe(
        map(this.extractData),
        catchError((error: HttpErrorResponse) => {
          return throwError(error.message || 'server error.');
        })
      );
  }

  getTopics(name: string) {
    const headers = {
      'Authorization': environment.token,
      'Accept': 'application/vnd.github.mercy-preview+json'
    };
    return this.httpClient
      .get<{}>('https://api.github.com/repos/Decathlon/' + name + '/topics', {headers})
      .pipe(
        map(this.extractTopicData),
        catchError((error: HttpErrorResponse) => {
          return throwError(error.message || 'server error.');
        })
      );
  }

  extractData(result: any): any {
    return result;
  }

  extractTopicData(result: any): string[] {
    return result.names;
  }
}
