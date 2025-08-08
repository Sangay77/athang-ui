import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { faUser, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { FeeService } from '../../../services/fee.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaymentResponseService } from '../../../services/payment-response.service';

@Component({
  selector: 'app-fee-payment',
  templateUrl: './fee-payment.component.html',
  styleUrls: ['./fee-payment.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class FeePaymentComponent implements OnInit {
  feeForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  loading = false;

  faUser = faUser;
  faCreditCard = faCreditCard;

  constructor(
    private fb: FormBuilder,
    private feeService: FeeService,
    private router: Router,
    private paymentResponseService: PaymentResponseService
  ) {}

  ngOnInit(): void {
    this.feeForm = this.fb.group({
      traineeType: ['', Validators.required],
      feeType: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.feeForm.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      this.successMessage = '';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formData = this.feeForm.value;

    this.feeService.createFeeInvoice(formData).subscribe({
      next: (response) => {
        console.log('Payment response:', response);

        if (response.status && response.status.toUpperCase() === 'FAILED') {
          this.errorMessage = '❌ Payment failed: ' + (response.message || 'Unknown error');
        } else if (response.bfs_responseCode === '00') {
          this.paymentResponseService.setResponse(response);
          this.router.navigate(['/dashboard/account-inquiry']);
        } else {
          this.errorMessage = '⚠️ Payment authorization failed: ' + (response.message || 'Unknown error');
          console.warn('Authorization warning:', response);
        }
      },
      error: (err) => {
        this.errorMessage = '❌ Server error. Please try again later.';
        console.error('HTTP error:', err);
      },
      complete: () => {
        this.loading = false;
        this.feeForm.reset();
      }
    });
  }
}
