import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService  implements HttpInterceptor{

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const transformedRequest = req.clone({
      headers: req.headers.set('Cache-Control', 'no-cache')
        .set('Pragma', 'no-cache')
        .set('If-Modified-Since', '0')
    });
    return next.handle(transformedRequest).pipe(
        catchError((err) => {
          if (req.url.indexOf('key_gen') > -1) {
            this.router.navigate(['login']);
            return throwError(err);
          }
          return throwError(err);
        }),
        finalize(() => {
        })
      );
  }
}
