import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AiKnowledgeBaseForm } from './ai-knowledge-base-form';

describe('AiKnowledgeBaseForm', () => {
  let component: AiKnowledgeBaseForm;
  let fixture: ComponentFixture<AiKnowledgeBaseForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiKnowledgeBaseForm],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MessageService, useValue: { add: vi.fn(), clear: vi.fn() } },
        { provide: DialogService, useValue: { open: vi.fn().mockReturnValue({ onClose: { subscribe: vi.fn() } }) } },
        { provide: DynamicDialogConfig, useValue: { data: {} } },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: { data: {}, params: {}, queryParams: {} }, params: of({}), queryParams: of({}) } },
        { provide: 'HttpClientWithoutInterceptors', useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AiKnowledgeBaseForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
