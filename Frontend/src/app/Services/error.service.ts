import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router){

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        let errorHeading = '';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorHeading = error.statusText;
              errorMessage = 'Bad request';
              break;
            case 401:
              errorHeading = error.statusText;
              errorMessage = 'Invalid loginId or Password';
              // this.router.navigate(['']); // Redirect to login page
              break;
            case 404:
              errorMessage = 'The requested resource was not found.';
              // this.router.navigate(['/404']); // Redirect to a 404 page
              break;
            case 500:
              errorHeading = error.statusText;
              errorMessage = 'Internal server error - please try again later.';
              // this.router.navigate(['/500']); // Redirect to a 500 error page
              break;
            default:
              errorHeading = error.statusText;
              errorMessage = `Unexpected error occurred. Status code: ${error.status}`;
              break;
          }
        }

        Swal.fire({
          icon: "error",
          title: errorHeading,
          text: errorMessage,
        });
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}