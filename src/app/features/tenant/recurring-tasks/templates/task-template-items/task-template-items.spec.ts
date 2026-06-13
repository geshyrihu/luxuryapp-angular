import { IonicMocks } from 'src/app/core/testing/ionic-mocks';

vi.mock('@ionic/angular/standalone', () => ({ ...IonicMocks }));
vi.mock('@ionic/core', () => ({}));
vi.mock('@ionic/core/components', () => ({}));
vi.mock('ionicons/icons', () => ({ storefrontOutline: 'storefront-outline' }));
vi.mock('ionicons', () => ({ addIcons: vi.fn() }));

import { vi } from 'vitest';
import { signal } from '@angular/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { TableScrollHeightService } from 'src/app/core/services/table-scroll-height.service';
import { TaskTemplateItems } from './task-template-items';

describe('TaskTemplateItems', () => {
  let component: TaskTemplateItems;
  let fixture: ComponentFixture<TaskTemplateItems>;
  let mockApiResponseS: any;
  let mockDialogHandlerS: any;
  let mockRoute: any;
  let mockRouter: any;
  let mockTableScrollHeightS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetItem: vi.fn().mockResolvedValue(null),
      onGetList: vi.fn().mockResolvedValue([]),
      onDelete: vi.fn().mockResolvedValue(true),
      onPut: vi.fn().mockResolvedValue(true),
    };
    mockDialogHandlerS = {
      openDialog: vi.fn().mockResolvedValue(true),
      sizeLg: 'lg',
    };
    mockRoute = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue('tmpl-1'),
        },
      },
    };
    mockRouter = {
      navigate: vi.fn(),
    };
    mockTableScrollHeightS = {
      scrollHeight: signal('600px'),
    };

    TestBed.overrideComponent(TaskTemplateItems, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [TaskTemplateItems],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskTemplateItems);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signal values', () => {
    expect(component.templateInfo()).toBeNull();
    expect(component.items()).toEqual([]);
    expect(component.templateId).toBe('');
  });

  it('should load template info and items on init', async () => {
    const fakeTemplate = { id: 'tmpl-1', name: 'Template 1' };
    const fakeItems = [{ id: 'item-1', title: 'Item 1' }];
    mockApiResponseS.onGetItem.mockResolvedValue(fakeTemplate);
    mockApiResponseS.onGetList.mockResolvedValue(fakeItems);

    component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onGetItem).toHaveBeenCalledWith(
      'recurring-tasks/templates/tmpl-1',
    );
    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      'recurring-tasks/templates/tmpl-1/items',
    );
    expect(component.templateInfo()).toEqual(fakeTemplate);
    expect(component.items()).toEqual(fakeItems);
  });

  it('should not load if no templateId', () => {
    mockRoute.snapshot.paramMap.get.mockReturnValue(null);

    component.ngOnInit();

    expect(mockApiResponseS.onGetItem).not.toHaveBeenCalled();
    expect(mockApiResponseS.onGetList).not.toHaveBeenCalled();
  });

  it('should delete item and reload list on success', async () => {
    mockApiResponseS.onGetList.mockResolvedValue([]);

    component.onDeleteItem('item-1');

    expect(mockApiResponseS.onDelete).toHaveBeenCalledWith(
      'recurring-tasks/templates/items/item-1',
    );
    await new Promise(resolve => setTimeout(resolve));
    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      'recurring-tasks/templates/tmpl-1/items',
    );
  });

  it('should not reload on delete when API returns false', async () => {
    mockApiResponseS.onDelete.mockResolvedValue(false);
    await new Promise(resolve => setTimeout(resolve));
    mockApiResponseS.onGetList.mockClear();

    component.onDeleteItem('item-1');
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onGetList).not.toHaveBeenCalled();
  });

  it('should open item form dialog for new item', async () => {
    component.templateId = 'tmpl-1';
    component.showItemForm();
    await new Promise(resolve => setTimeout(resolve));

    expect(mockDialogHandlerS.openDialog).toHaveBeenCalledWith(
      expect.any(Function),
      { templateId: 'tmpl-1', item: undefined },
      'Nuevo Item',
      'lg',
    );
  });

  it('should open item form dialog for existing item', async () => {
    const item = { id: 'item-1', title: 'Test' };
    component.templateId = 'tmpl-1';
    component.showItemForm(item as any);
    await new Promise(resolve => setTimeout(resolve));

    expect(mockDialogHandlerS.openDialog).toHaveBeenCalledWith(
      expect.any(Function),
      { templateId: 'tmpl-1', item },
      'Editar Item',
      'lg',
    );
  });

  it('should reload items on dialog close with result true', async () => {
    mockApiResponseS.onGetList.mockResolvedValue([]);

    component.showItemForm();
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      'recurring-tasks/templates/tmpl-1/items',
    );
  });

  it('should send reorder request on row reorder', async () => {
    component.templateId = 'tmpl-1';
    component.items.set([
      { id: 'a', title: 'A' } as any,
      { id: 'b', title: 'B' } as any,
    ]);

    component.onRowReorder({});
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onPut).toHaveBeenCalledWith(
      'recurring-tasks/templates/tmpl-1/items/reorder',
      { itemIdsInOrder: ['a', 'b'] },
    );
  });

  it('should return priority display for High priority', () => {
    expect(component.getPriorityDisplay(0)).toEqual({
      text: 'Alta',
      severity: 'danger',
    });
  });

  it('should return priority display for Low priority', () => {
    expect(component.getPriorityDisplay(1)).toEqual({
      text: 'Baja',
      severity: 'info',
    });
  });

  it('should return priority display for unknown priority', () => {
    expect(component.getPriorityDisplay(99)).toEqual({
      text: 'Desconocida',
      severity: 'secondary',
    });
  });

  it('should format daily recurrence rule', () => {
    const result = component.formatRecurrenceRule('FREQ=DAILY;INTERVAL=2');
    expect(result).toBe('Cada 2 d\u00edas');
  });

  it('should format weekly recurrence rule with days', () => {
    const result = component.formatRecurrenceRule('FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,FR');
    expect(result).toContain('Cada 1 semana');
    expect(result).toContain('Lunes');
    expect(result).toContain('Viernes');
  });

  it('should format monthly recurrence rule by month day', () => {
    const result = component.formatRecurrenceRule('FREQ=MONTHLY;BYMONTHDAY=15');
    expect(result).toBe('Cada 1 mes el d\u00eda 15');
  });

  it('should format monthly recurrence rule by position and day', () => {
    const result = component.formatRecurrenceRule('FREQ=MONTHLY;BYDAY=1MO');
    expect(result).toContain('el primer Lunes');
  });

  it('should format yearly recurrence rule', () => {
    const result = component.formatRecurrenceRule('FREQ=YEARLY;INTERVAL=1;BYMONTH=12;BYMONTHDAY=25');
    expect(result).toContain('Cada 1');
    expect(result).toContain('A');
    expect(result).toContain('25');
    expect(result).toContain('Diciembre');
  });

  it('should return default text for empty rrule', () => {
    expect(component.formatRecurrenceRule('')).toBe('No definida');
  });
});
