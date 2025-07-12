import { Injectable } from '@angular/core';
import { catchError, debounceTime, forkJoin, map, mergeMap, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  // Fetch profile data from Json.
  getCombinedData(): Observable<any>{
    return this.http.get<any>('assets/data/profile.json').pipe(
      debounceTime(100)
    );
  }

}
