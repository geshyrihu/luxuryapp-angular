import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FlatpickrDefaults } from 'angularx-flatpickr';
import { LogApiReport } from './log-api-report';

describe('LogApiReport', () => {
  let component: LogApiReport;
  let fixture: ComponentFixture<LogApiReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogApiReport],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MessageService, useValue: { add: vi.fn(), clear: vi.fn() } },
        { provide: DialogService, useValue: { open: vi.fn().mockReturnValue({ onClose: { subscribe: vi.fn() } }) } },
        { provide: DynamicDialogConfig, useValue: { data: {} } },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: { data: {}, params: {}, queryParams: {} }, params: of({}), queryParams: of({}) } },
        { provide: 'HttpClientWithoutInterceptors', useValue: (globalThis as any).__mockHttpClient },
        { provide: FlatpickrDefaults, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LogApiReport);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
