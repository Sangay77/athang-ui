import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaymentResponseService } from '../../../services/payment-response.service';
import { PaymentService } from '../../../services/payment.service';
import { Router } from '@angular/router';

interface Bank {
  code: string;
  name: string;
}

@Component({
  selector: 'app-account-inquiry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-inquiry.component.html',
  styleUrls: ['./account-inquiry.component.css']
})
export class AccountInquiryComponent implements OnInit {
  form!: FormGroup;
  bankList: Bank[] = [];
  showForm = false;
  bfsTxnId: string | null = null;
  inquiryResult: any = null;
  loading = false;
  errorMessage: string | null = null;
  inquiryFailed = false;

  constructor(
    private fb: FormBuilder,
    private paymentResponseService: PaymentResponseService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const response = this.paymentResponseService.getResponse();

    if (response?.bfs_responseCode === '00') {
      this.showForm = true;
      this.bfsTxnId = response.bfs_bfsTxnId;

      const decodedBankList = decodeURIComponent(response.bfs_bankList);
      this.bankList = decodedBankList.split('#').map(item => {
        const [code, name] = item.split('~');
        return { code, name } as Bank;
      });

      this.form = this.fb.group({
        bank: ['', Validators.required],
        accountNumber: ['', [Validators.required, Validators.pattern('^[0-9]{9,14}$')]],
      });
    } else {
      console.warn('Invalid or no response found in PaymentResponseService');
    }
  }

  submit(): void {
    this.inquiryResult = null;
    this.errorMessage = null;
    this.inquiryFailed = false;

    if (this.form.valid && this.bfsTxnId) {
      const { bank, accountNumber } = this.form.value;
      this.loading = true;

      this.paymentService.accountInquiry(this.bfsTxnId, bank, accountNumber).subscribe({
        next: (res) => {
          this.loading = false;
          this.inquiryResult = res;

          if (res.bfs_responseDesc === 'Success' && res.bfs_responseCode === '00') {
            this.router.navigate(['/dashboard/debit-request'], {
              queryParams: { txnId: this.bfsTxnId }
            });
          } else {
            this.errorMessage = `Account inquiry failed. [Code: ${res.bfs_responseCode}] ${res.bfs_responseDesc || 'Unknown error'}`;
            this.inquiryFailed = true;
          }
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = 'Account inquiry failed. Please try again.';
          this.inquiryFailed = true;
          console.error('Account inquiry error:', err);
        }
      });
    }
  }

  retry(): void {
    this.inquiryFailed = false;
    this.submit();
  }

  clearForm(): void {
    this.form.reset();
    this.inquiryResult = null;
    this.errorMessage = null;
    this.inquiryFailed = false;
  }

  onCancel(): void {
    this.form.reset();
    this.inquiryResult = null;
    this.errorMessage = null;
    this.inquiryFailed = false;
    this.router.navigate(['/dashboard/fee-payment']);
  }
}


