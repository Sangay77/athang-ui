import { TestBed } from '@angular/core/testing';

import { PaymentResponseService } from './payment-response.service';

describe('PaymentResponseService', () => {
  let service: PaymentResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
