import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomerHeaderDataMobile } from './customer-header-data-mobile';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { vi } from 'vitest';
import { of } from 'rxjs';

describe('CustomerHeaderDataMobile', () => {
  let component: CustomerHeaderDataMobile;
  let fixture: ComponentFixture<CustomerHeaderDataMobile>;
  let customerIdServiceMock: any;

  beforeEach(() => {
    customerIdServiceMock = {
      nombreCorto: vi.fn().mockReturnValue('Test Customer'),
      customerPhotoPath: vi.fn().mockReturnValue('photo.jpg'),
      customerId: vi.fn().mockReturnValue('123'),
      setCustomerId: vi.fn().mockReturnValue(of(true)),
    };

    TestBed.overrideComponent(CustomerHeaderDataMobile, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomerHeaderDataMobile],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CustomerIdService, useValue: customerIdServiceMock },
      ],
    });

    fixture = TestBed.createComponent(CustomerHeaderDataMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject customerIdService', () => {
    expect(component.customerIdS).toBeDefined();
  });
});
