// invoice.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvoiceRequest } from '../common/invoice-request.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private apiUrl = 'http://localhost:8083/api/v1/invoices'; 

  constructor(private http: HttpClient) { }

  createInvoice(invoice: InvoiceRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate`, invoice);
  }

  fetchInvoicById(invoiceId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${invoiceId}`);
  }
}
