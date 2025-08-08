import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class DebitRequestComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  txnId: string | null = null;
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  timer: number = 420; // 7 minutes in seconds
  timerDisplay: string = '07:00';
  timerExpired = false;
  private countdownInterval: any;

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
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{4,6}$')]]
    });

    this.startTimer();
  }

  startTimer(): void {
    this.updateTimerDisplay();
    this.countdownInterval = setInterval(() => {
      this.timer--;
      this.updateTimerDisplay();

      if (this.timer <= 0) {
        this.timerExpired = true;
        clearInterval(this.countdownInterval);
        this.errorMessage = '⏰ OTP expired. Please request a new OTP.';
      }
    }, 1000);
  }

  updateTimerDisplay(): void {
    const minutes = Math.floor(this.timer / 60);
    const seconds = this.timer % 60;
    this.timerDisplay = `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : '' + num;
  }

  submit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.timerExpired) {
      this.errorMessage = '⏰ OTP expired. Please request a new OTP.';
      return;
    }

    if (this.form.valid && this.txnId) {
      const bfs_remitterOtp = this.form.value.otp;
      this.loading = true;

      this.paymentService.debitRequest({ bfs_bfsTxnId: this.txnId, bfs_remitterOtp }).subscribe({
        next: (res) => {
          this.loading = false;
          this.successMessage = 'Debit request successful!';
          console.log('Debit request response:', res);
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

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  cancel(): void {
    console.log('Debit request cancelled');
    this.errorMessage = null;
    this.successMessage = null;
    this.timerExpired = false
    this.router.navigate(['/dashboard/bookings']);
  }
}
