import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnquiryModel } from '../common/enquiry.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8083/api/v1/payment';

  constructor(private http: HttpClient) { }

  authorizePayment(invoiceId: number, totalAmount: number, description: string): Observable<any> {
    const payload = {
      invoiceId: invoiceId,
      txnAmount: totalAmount,
      bfs_paymentDesc: description
    };
    return this.http.post(`${this.apiUrl}/authorise`, payload);
  }


  accountInquiry(txnId: string, bankCode: string, accountNumber: string): Observable<any> {
    const payload = {
      bfs_bfsTxnId: txnId,
      bfs_remitterBankId: bankCode,
      bfs_remitterAccNo: accountNumber
    };
    return this.http.post(`${this.apiUrl}/account-inquiry`, payload);
  }

  debitRequest(payload: { bfs_bfsTxnId: string, bfs_remitterOtp: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/debit-request`, payload);
  }

}
