import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CfdiUseList } from './cfdi-use-list';

describe('CfdiUseList', () => {
  let component: CfdiUseList;
  let fixture: ComponentFixture<CfdiUseList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CfdiUseList],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MessageService, useValue: { add: vi.fn(), clear: vi.fn() } },
        { provide: DialogService, useValue: { open: vi.fn().mockReturnValue({ onClose: { subscribe: vi.fn() } }) } },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CfdiUseList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

