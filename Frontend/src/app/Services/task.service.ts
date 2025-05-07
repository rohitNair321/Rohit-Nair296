import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = environment.taskApiUrl;
  private taskSubject = new BehaviorSubject<Task[]>([]);
  private task = new BehaviorSubject<any>(null);
  
  constructor(private httpReq: HttpClient) { }

  getTaskList(){
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.httpReq.get<any[]>(`${this.apiUrl}/todos`,{headers}).pipe(
      map(response => {
        if (response && response) {
          
        }
      })
    );
  }


}

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  onhold: boolean;
  inpregress: boolean;
  delete: boolean;
}
