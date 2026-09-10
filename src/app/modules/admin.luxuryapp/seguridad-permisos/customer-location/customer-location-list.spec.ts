import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

import { CustomerLocationList } from './customer-location-list';
import { ApiResponseService } from 'src/app/core/http/services/api-response.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { TableScrollHeightService } from 'src/app/core/services/table-scroll-height.service';
import { EndpointsAdmin } from 'src/app/core/constants/endpoints/admin.endpoints';
import { CustomerLocationDto } from './interfaces/customer-location.dto';
import { CustomerLocationType, CustomerLocationTypeLabels } from './interfaces/customer-location-type.enum';

describe('CustomerLocationList', () => {
  let component: CustomerLocationList;

  const mockDialogRef = {
    close: vi.fn(),
  };

  const mockDialogConfig = {
    data: { customerId: 'cust-1', customerName: 'Test Customer' },
  };

  const mockApiResponseService = {
    onGetList: vi.fn().mockResolvedValue([]),
    onDelete: vi.fn().mockResolvedValue(true),
  };

  const mockDialogHandlerService = {
    openDialog: vi.fn().mockResolvedValue(false),
  };

  const mockTableScrollHeightService = {
    scrollHeight: '400px',
  };

  const mockEndpoints = {
    CustomerLocations: {
      listByCustomer: vi.fn().mockReturnValue('api/customer-locations/customer/cust-1'),
      delete: vi.fn().mockReturnValue('api/customer-locations/id'),
    },
  };

  beforeEach(() => {
    TestBed.overrideComponent(CustomerLocationList, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      providers: [
        { provide: DynamicDialogRef, useValue: mockDialogRef },
        { provide: DynamicDialogConfig, useValue: mockDialogConfig },
        { provide: ApiResponseService, useValue: mockApiResponseService },
        { provide: DialogHandlerService, useValue: mockDialogHandlerService },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightService },
        { provide: EndpointsAdmin, useValue: mockEndpoints },
        CustomerLocationList,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    component = TestBed.inject(CustomerLocationList);
    component.ngOnInit();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with customer data from config', () => {
    expect(component.customerId).toBe('cust-1');
    expect(component.customerName).toBe('Test Customer');
  });

  it('should initialize signals with default values', () => {
    expect(component.dataSignal()).toEqual([]);
    expect(component.loading()).toBe(true);
    expect(component.globalFilterFields()).toEqual([
      'name',
      'locationType',
      'phoneOne',
      'contactName',
    ]);
  });

  describe('onLoadData', () => {
    it('should load data from API', async () => {
      const mockData: CustomerLocationDto[] = [
        {
          id: 'loc-1',
          customerId: 'cust-1',
          name: 'Main Gate',
          locationType: CustomerLocationType.MainGate,
          phoneOne: '5512345678',
          phoneTwo: '5512345679',
          contactName: 'John Doe',
          notes: 'Main entrance',
          sortOrder: 1,
          isActive: true,
        },
        {
          id: 'loc-2',
          customerId: 'cust-1',
          name: 'Lobby',
          locationType: CustomerLocationType.Lobby,
          phoneOne: '5512345680',
          phoneTwo: '',
          contactName: 'Jane Smith',
          notes: '',
          sortOrder: 2,
          isActive: true,
        },
      ];

      mockApiResponseService.onGetList.mockResolvedValue(mockData);
      component.onLoadData();

      await Promise.resolve();

      expect(mockApiResponseService.onGetList).toHaveBeenCalledWith(
        'api/customer-locations/customer/cust-1'
      );
      expect(component.dataSignal()).toEqual(mockData);
      expect(component.loading()).toBe(false);
    });

    it('should not load if customerId is empty', () => {
      component.customerId = '';
      component.onLoadData();
      expect(mockApiResponseService.onGetList).not.toHaveBeenCalled();
    });
  });

  describe('getLocationTypeLabel', () => {
    it('should return correct label for each type', () => {
      expect(component.getLocationTypeLabel(CustomerLocationType.MainGate)).toBe(
        CustomerLocationTypeLabels[CustomerLocationType.MainGate]
      );
      expect(component.getLocationTypeLabel(CustomerLocationType.PedestrianGate)).toBe(
        CustomerLocationTypeLabels[CustomerLocationType.PedestrianGate]
      );
      expect(component.getLocationTypeLabel(CustomerLocationType.Lobby)).toBe(
        CustomerLocationTypeLabels[CustomerLocationType.Lobby]
      );
      expect(component.getLocationTypeLabel(CustomerLocationType.Reception)).toBe(
        CustomerLocationTypeLabels[CustomerLocationType.Reception]
      );
      expect(component.getLocationTypeLabel(CustomerLocationType.Office)).toBe(
        CustomerLocationTypeLabels[CustomerLocationType.Office]
      );
    });

    it('should return the type itself if not found in labels', () => {
      expect(component.getLocationTypeLabel('UnknownType')).toBe('UnknownType');
    });
  });

  describe('onEdit', () => {
    it('should open dialog with edit data', async () => {
      const item: CustomerLocationDto = {
        id: 'loc-1',
        customerId: 'cust-1',
        name: 'Test Location',
        locationType: CustomerLocationType.MainGate,
        phoneOne: '5512345678',
        phoneTwo: '',
        contactName: '',
        notes: '',
        sortOrder: 0,
        isActive: true,
      };

      mockDialogHandlerService.openDialog.mockResolvedValue(true);
      component.onEdit(item);

      await Promise.resolve();

      expect(mockDialogHandlerService.openDialog).toHaveBeenCalledWith(
        expect.any(Function),
        { customerId: 'cust-1', id: 'loc-1' },
        'Editar Ubicación',
        expect.any(String)
      );
      expect(mockApiResponseService.onGetList).toHaveBeenCalled();
    });

    it('should not reload data if dialog returns false', () => {
      const item: CustomerLocationDto = {
        id: 'loc-1',
        customerId: 'cust-1',
        name: 'Test Location',
        locationType: CustomerLocationType.MainGate,
        phoneOne: '5512345678',
        phoneTwo: '',
        contactName: '',
        notes: '',
        sortOrder: 0,
        isActive: true,
      };

      mockDialogHandlerService.openDialog.mockResolvedValue(false);
      component.onEdit(item);

      expect(mockApiResponseService.onGetList).not.toHaveBeenCalled();
    });
  });

  describe('onDelete', () => {
    it('should call API and remove item from signal on success', async () => {
      const mockData: CustomerLocationDto[] = [
        {
          id: 'loc-1',
          customerId: 'cust-1',
          name: 'Location 1',
          locationType: CustomerLocationType.MainGate,
          phoneOne: '5512345678',
          phoneTwo: '',
          contactName: '',
          notes: '',
          sortOrder: 0,
          isActive: true,
        },
        {
          id: 'loc-2',
          customerId: 'cust-1',
          name: 'Location 2',
          locationType: CustomerLocationType.Lobby,
          phoneOne: '5512345680',
          phoneTwo: '',
          contactName: '',
          notes: '',
          sortOrder: 0,
          isActive: true,
        },
      ];

      component.dataSignal.set(mockData);
      mockApiResponseService.onDelete.mockResolvedValue(true);

      component.onDelete('loc-1');

      await Promise.resolve();

      expect(mockApiResponseService.onDelete).toHaveBeenCalledWith(
        'api/customer-locations/loc-1'
      );
      expect(component.dataSignal().length).toBe(1);
      expect(component.dataSignal()[0].id).toBe('loc-2');
    });

    it('should not remove item if API returns false', () => {
      const mockData: CustomerLocationDto[] = [
        {
          id: 'loc-1',
          customerId: 'cust-1',
          name: 'Location 1',
          locationType: CustomerLocationType.MainGate,
          phoneOne: '5512345678',
          phoneTwo: '',
          contactName: '',
          notes: '',
          sortOrder: 0,
          isActive: true,
        },
      ];

      component.dataSignal.set(mockData);
      mockApiResponseService.onDelete.mockResolvedValue(false);

      component.onDelete('loc-1');

      expect(component.dataSignal().length).toBe(1);
    });
  });

  describe('onNew', () => {
    it('should open dialog for new location', async () => {
      mockDialogHandlerService.openDialog.mockResolvedValue(true);
      component.onNew();

      await Promise.resolve();

      expect(mockDialogHandlerService.openDialog).toHaveBeenCalledWith(
        expect.any(Function),
        { customerId: 'cust-1' },
        'Nueva Ubicación',
        expect.any(String)
      );
      expect(mockApiResponseService.onGetList).toHaveBeenCalled();
    });

    it('should not reload data if dialog returns false', () => {
      mockDialogHandlerService.openDialog.mockResolvedValue(false);
      component.onNew();

      expect(mockApiResponseService.onGetList).not.toHaveBeenCalled();
    });
  });

  describe('table configuration', () => {
    it('should have correct rows per page options', () => {
      expect(component.rowsPerPageOptions).toEqual([10, 25, 50, 100]);
    });

    it('should have tablePrimeNgRows defined', () => {
      expect(component.tablePrimeNgRows).toBeGreaterThan(0);
    });
  });
});