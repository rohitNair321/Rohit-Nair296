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

  getTaskList(recordCount: number): Observable<Task[]> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    // Add query parameters
    const params = new HttpParams().set('limit', recordCount.toString());

    return this.httpReq.get<Todos>(`${this.apiUrl}`, { headers, params }).pipe(
      map((res: Todos) => {
        // Extract the list of tasks from the response
        const tasks = res.todos;
        // Update the BehaviorSubject with the new list of tasks
        this.taskSubject.next(tasks);
        return tasks; // Return the list of tasks
      }),
      catchError((error) => {
        console.error('Error fetching task list:', error);
        throw error; // Rethrow the error to handle it in the component
      })
    );
  }


}

export interface Todos {
  limit:number
  skip:number
  total:number
  todos:Task[]
}
export interface Task {
  completed:boolean,
  id:number,
  userId:number,
  todos:string
}

