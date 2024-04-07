import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private taskSubject = new BehaviorSubject<Task[]>([]);
  // private taskSubject: any;
  // task$ = this.taskSubject.asObservable();
  
  constructor(private httpReq: HttpClient) { }

  getTaskList(): Observable<Task[]>{
    // this.httpReq.get('./assets/task-data.json').toPromise().then((data) =>{
    //   console.log(data);
    //   this.taskList.next(data);
    // });
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
