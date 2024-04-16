import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private taskSubject = new BehaviorSubject<Task[]>([]);
  private task = new BehaviorSubject<any>(null);
  
  constructor(private httpReq: HttpClient) { }

  getTaskList(): Observable<Task[]>{
    return this.httpReq.get<Task[]>('./assets/task-data.json').pipe(
      tap(tasks => {
        this.taskSubject.next(tasks);
      }),
      catchError(error => {
        throw error;
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
