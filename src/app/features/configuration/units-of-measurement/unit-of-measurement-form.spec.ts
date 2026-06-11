import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UnitOfMeasurementForm } from './unit-of-measurement-form';

describe('UnitOfMeasurementForm', () => {
  let component: UnitOfMeasurementForm;
  let fixture: ComponentFixture<UnitOfMeasurementForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitOfMeasurementForm],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MessageService, useValue: { add: vi.fn(), clear: vi.fn() } },
        { provide: DialogService, useValue: { open: vi.fn().mockReturnValue({ onClose: { subscribe: vi.fn() } }) } },
        { provide: DynamicDialogConfig, useValue: { data: {} } },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UnitOfMeasurementForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

