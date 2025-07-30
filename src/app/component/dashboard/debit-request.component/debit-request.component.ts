import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-debit-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './debit-request.component.html',
  styleUrls: ['./debit-request.component.css']
})
export class DebitRequestComponent implements OnInit {
  form!: FormGroup;
  txnId: string | null = null;
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.txnId = params.get('txnId');
    });

    this.form = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{4,6}$')]] // assuming 4-6 digit OTP
    });
  }

  submit(): void {
  this.errorMessage = null;
  this.successMessage = null;

  if (this.form.valid && this.txnId) {
    const bfs_remitterOtp = this.form.value.otp;
    this.loading = true;

    this.paymentService.debitRequest({ bfs_bfsTxnId: this.txnId, bfs_remitterOtp }).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = 'Debit request successful!';
        console.log('Debit request response:', res);

        // Navigate to invoice-summary with response data as state
        this.router.navigate(['/dashboard/invoice-summary'], {
          state: { data: res }
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Debit request failed. Please try again.';
        console.error('Debit request error:', err);
      }
    });
  }
}


 }
