import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ApprovalRules } from './approval-rules';

describe('ApprovalRules', () => {
  let component: ApprovalRules;
  let fixture: ComponentFixture<ApprovalRules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalRules],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MessageService, useValue: { add: vi.fn(), clear: vi.fn() } },
        { provide: DialogService, useValue: { open: vi.fn().mockReturnValue({ onClose: { subscribe: vi.fn() } }) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalRules);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

