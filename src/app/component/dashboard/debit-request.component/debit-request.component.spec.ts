import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitRequestComponent } from './debit-request.component';

describe('DebitRequestComponent', () => {
  let component: DebitRequestComponent;
  let fixture: ComponentFixture<DebitRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebitRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebitRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
