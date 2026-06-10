import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { vi } from 'vitest';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { CardEmployee } from './card-employee';

describe('CardEmployee', () => {
  let fixture: ComponentFixture<CardEmployee>;
  let component: CardEmployee;

  const mockApiResponseS = {
    onGetItem: vi.fn().mockResolvedValue({
      firstName: 'John',
      lastName: 'Doe',
      photoPath: 'img.jpg',
    }),
  };

  beforeEach(() => {
    TestBed.overrideComponent(CardEmployee, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [CardEmployee],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DynamicDialogConfig, useValue: { data: { applicationUserId: 'user-1' } } },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
      ],
    });

    fixture = TestBed.createComponent(CardEmployee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize applicationUserId from config data', () => {
    expect(component.applicationUserId).toBe('');
  });

  it('should load card data on init', () => {
    expect(mockApiResponseS.onGetItem).toHaveBeenCalled();
  });

  it('should load data on onLoadData call', () => {
    mockApiResponseS.onGetItem.mockResolvedValue({
      firstName: 'Jane',
      photoPath: 'jane.jpg',
    });
    component.onLoadData('user-2');
    expect(mockApiResponseS.onGetItem).toHaveBeenCalled();
  });
});
