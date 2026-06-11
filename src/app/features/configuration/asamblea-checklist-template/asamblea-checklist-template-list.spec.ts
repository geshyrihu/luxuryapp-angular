import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AsambleaChecklistTemplateList } from './asamblea-checklist-template-list';

describe('AsambleaChecklistTemplateList', () => {
  let component: AsambleaChecklistTemplateList;
  let fixture: ComponentFixture<AsambleaChecklistTemplateList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsambleaChecklistTemplateList],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MessageService, useValue: { add: vi.fn(), clear: vi.fn() } },
        { provide: DialogService, useValue: { open: vi.fn().mockReturnValue({ onClose: { subscribe: vi.fn() } }) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AsambleaChecklistTemplateList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

