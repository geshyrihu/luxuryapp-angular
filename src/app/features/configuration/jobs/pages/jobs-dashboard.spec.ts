import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { JobsDashboard } from './jobs-dashboard';

describe('JobsDashboard', () => {
  let component: JobsDashboard;
  let fixture: ComponentFixture<JobsDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobsDashboard],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MessageService, useValue: { add: vi.fn(), clear: vi.fn() } },
        { provide: DialogService, useValue: { open: vi.fn().mockReturnValue({ onClose: { subscribe: vi.fn() } }) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JobsDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

