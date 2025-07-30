import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentResponseService {
  private responseSubject = new BehaviorSubject<any>(null);
  response$ = this.responseSubject.asObservable();

  setResponse(response: any): void {
    this.responseSubject.next(response);
  }

  getResponse(): any {
    return this.responseSubject.value;
  }
}
