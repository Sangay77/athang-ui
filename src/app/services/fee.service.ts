import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeeService {

    private apiUrl = 'http://localhost:8083/api/v1/fee';
    
    constructor(private http: HttpClient) { }

    createFeeInvoice(feeData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/generate`, feeData);
    }

    fetchFeeInvoiceById(invoiceId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/fee/${invoiceId}`);
    }

  
}
