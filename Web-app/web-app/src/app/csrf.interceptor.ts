import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

function getCookie(name: string): string | null {
    const m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return m ? m.pop()! : null;
}

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let clone = req.clone({ withCredentials: true });
    if (['POST','PUT','PATCH','DELETE'].includes(req.method)) {
    const token = getCookie('csrftoken');
    if (token) clone = clone.clone({ setHeaders: { 'X-CSRFToken': token } });
    }
    return next.handle(clone);
    }
}
