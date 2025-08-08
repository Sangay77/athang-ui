import { HttpInterceptorFn } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { throwError } from 'rxjs';

interface JwtPayload {
  exp?: number;
  sub?: string;
  fullName?: string;
  [key: string]: any;
}

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('jwtToken');

  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp && decoded.exp > now) {
        // Token valid — add Authorization header
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            'Content-Type':
              req.method === 'POST' || req.method === 'PUT'
                ? 'application/json'
                : req.headers.get('Content-Type') || '',
            Accept: 'application/json',
          },
        });
        return next(authReq);
      } else {
        // Token expired — clear storage and redirect
        console.warn('JWT token expired, clearing storage and redirecting to login');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');

        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }

        // Stop request here by returning an error observable
        return throwError(() => new Error('JWT token expired noko'));
      }
    } catch (error) {
      console.error('Error decoding JWT:', error);
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return throwError(() => new Error('Invalid JWT token'));
    }
  }

  // No token — proceed without auth header
  return next(req);
};
