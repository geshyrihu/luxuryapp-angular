import { IonicMocks } from 'src/app/core/testing/ionic-mocks';

vi.mock('@ionic/angular/standalone', () => ({ ...IonicMocks }));
vi.mock('@ionic/core', () => ({}));
vi.mock('@ionic/core/components', () => ({}));
vi.mock('ionicons/icons', () => ({ storefrontOutline: 'storefront-outline' }));
vi.mock('ionicons', () => ({ addIcons: vi.fn() }));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { AspRoleService } from 'src/app/core/services/asp-role.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { ListProvider } from './provider-list';

describe('ListProvider', () => {
  let component: ListProvider;
  let fixture: ComponentFixture<ListProvider>;
  let mockApiResponseS: any;
  let mockAspRoleS: any;
  let mockAuthS: any;
  let mockCustomerIdS: any;
  let mockDialogHandlerS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue({ items: [], totalRecords: 0 }),
      onDelete: vi.fn().mockResolvedValue(true),
      onPut: vi.fn().mockResolvedValue(true),
    };
    mockAspRoleS = { hasAny: vi.fn(() => false) };
    mockAuthS = {};
    mockCustomerIdS = { customerId: vi.fn(() => 'cust-123') };
    mockDialogHandlerS = {
      openDialog: vi.fn().mockResolvedValue(true),
      sizeLg: 'lg',
      sizeFull: 'full',
      sizeSm: 'sm',
    };

    TestBed.overrideComponent(ListProvider, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [ListProvider],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AspRoleService, useValue: mockAspRoleS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ListProvider);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signal values', () => {
    expect(component.dataSignal()).toEqual([]);
    expect(component.loading()).toBe(true);
    expect(component.totalRecords).toBe(0);
  });

  it('should load data on init', () => {
    component.ngOnInit();
    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith('providers/list', expect.objectContaining({
      customerId: 'cust-123',
      page: 1,
      recordsNumber: 30,
      filter: '',
    }));
    expect(mockAspRoleS.hasAny).toHaveBeenCalled();
  });

  it('should load data with pagination and filter', async () => {
    const mockResult = { items: [{ providerId: '1' }], totalRecords: 1 };
    mockApiResponseS.onGetList.mockResolvedValue(mockResult);
    await component.onLoadData(2, 50, 'test');
    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith('providers/list', expect.objectContaining({
      customerId: 'cust-123',
      page: 2,
      recordsNumber: 50,
      filter: 'test',
    }));
    expect(component.dataSignal()).toEqual([{ providerId: '1' }]);
    expect(component.totalRecords).toBe(1);
  });

  it('should delete a provider and update dataSignal', async () => {
    component.dataSignal.set([
      { providerId: '1', nameProvider: 'A' },
      { providerId: '2', nameProvider: 'B' },
    ]);
    await component.onDelete('1');
    expect(mockApiResponseS.onDelete).toHaveBeenCalledWith('providers/1');
    expect(component.dataSignal().length).toBe(1);
    expect(component.dataSignal()[0].providerId).toBe('2');
  });

  it('should not remove from dataSignal on delete when API returns false', () => {
    mockApiResponseS.onDelete.mockResolvedValue(false);
    component.dataSignal.set([{ providerId: '1', nameProvider: 'A' }]);
    component.onDelete('1');
    expect(component.dataSignal().length).toBe(1);
  });

  it('should call onLoadData on autorizar provider', () => {
    vi.spyOn(component as any, 'onLoadData');
    mockApiResponseS.onGetList.mockResolvedValue([]);
    component.onAutorizarProvider('prov-001');
    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith('providers/Autorizar/prov-001');
  });

  it('should show modal card via showModalCardProveedor', () => {
    const data = { providerId: '1', title: 'Card' };
    component.showModalCardProveedor(data);
    expect(mockDialogHandlerS.openDialog).toHaveBeenCalled();
  });

  it('should open provider use dialog via onConicidencias', () => {
    const data = { providerId: '1', title: 'Uses' };
    component.onConicidencias(data);
    expect(mockDialogHandlerS.openDialog).toHaveBeenCalled();
  });

  it('should open form modal via onModalForm', () => {
    const data = { providerId: '1', title: 'Edit' };
    component.onModalForm(data);
    expect(mockDialogHandlerS.openDialog).toHaveBeenCalled();
  });

  it('should call applyFilter after showModalCalificarProveedor on success', async () => {
    vi.spyOn(component, 'applyFilter');
    const data = { providerId: '1', nameProvider: 'Test' };
    await component.showModalCalificarProveedor(data);
    expect(mockDialogHandlerS.openDialog).toHaveBeenCalled();
  });

  it('should change provider state via onActivateProvider', () => {
    vi.spyOn(component as any, 'onLoadData');
    const data = { providerId: '1', state: true };
    component.onActivateProvider(data);
    expect(mockApiResponseS.onPut).toHaveBeenCalledWith('Providers/change-state/1/true', null);
  });

  it('should calculate promedio calificacion', () => {
    const data = [{ rating: 4 }, { rating: 5 }];
    const result = component.calificacionPromedio(data, 'rating');
    expect(result).toBe(4.5);
  });

  it('should update pagination via loadDataLazy', () => {
    vi.spyOn(component as any, 'onLoadData');
    component.loadDataLazy({ first: 30, rows: 30 });
    expect(component.page).toBe(2);
    expect(component.rows).toBe(30);
    expect(component.first).toBe(30);
  });

  it('should reset pagination on applyFilter', () => {
    vi.spyOn(component as any, 'onLoadData');
    component.first = 30;
    component.page = 2;
    component.applyFilter();
    expect(component.first).toBe(0);
    expect(component.page).toBe(1);
  });

  it('should reset pagination on onFilterChange', () => {
    vi.spyOn(component as any, 'onLoadData');
    component.first = 30;
    component.page = 2;
    component.onFilterChange();
    expect(component.first).toBe(0);
    expect(component.page).toBe(1);
  });
});
