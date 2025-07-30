import { Component } from '@angular/core';
import { BookingService } from '../../../services/booking';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking',
  imports: [CommonModule],
  templateUrl: './booking.html',
  styleUrl: './booking.css'
})
export class BookingsComponent {
bookingResponse: any;
  errorMessage: string | null = null;
  loading = false;

  constructor(private bookingService: BookingService) {}

  onBookTicket(): void {
    this.loading = true;
    this.errorMessage = null;
    this.bookingService.bookTicket().subscribe({
      next: (res) => {
        this.bookingResponse = res;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Booking failed!';
        console.error(err);
        this.loading = false;
      }
    });
  }
}
