import { IonicMocks } from 'src/app/core/testing/ionic-mocks';

vi.mock('@ionic/angular/standalone', () => ({ ...IonicMocks }));
vi.mock('@ionic/core', () => ({}));
vi.mock('@ionic/core/components', () => ({}));
vi.mock("@ui/web/pdf-viewer-modal/pdf-viewer-modal", () => ({
  PdfViewerModal: class {},
}));
vi.mock("heic2any", () => ({ default: vi.fn() }));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { AiService } from 'src/app/core/services/ai.service';
import { SwalService } from 'src/app/core/services/swal.service';
import { AspRoleService } from 'src/app/core/services/asp-role.service';
import { TableScrollHeightService } from 'src/app/core/services/table-scroll-height.service';
import { UnifiedPendingDashboard } from './unified-pending-dashboard';

describe('UnifiedPendingDashboard', () => {
  let component: UnifiedPendingDashboard;
  let fixture: ComponentFixture<UnifiedPendingDashboard>;
  let mockApiResponseS: any;
  let mockCustomerIdS: any;
  let mockDialogHandlerS: any;
  let mockRouter: any;
  let mockAiService: any;
  let mockSwalService: any;
  let mockAspRoleS: any;
  let mockTableScrollHeightS: any;

  beforeEach(async () => {
    mockApiResponseS = { onGetList: vi.fn(), onPost: vi.fn() };
    mockCustomerIdS = { customerId: signal('cust-123') };
    mockDialogHandlerS = { openDialog: vi.fn(), sizeMd: '600px', sizeLg: '900px' };
    mockRouter = { navigateByUrl: vi.fn() };
    mockAiService = { analyzeDashboard: vi.fn() };
    mockSwalService = { fire: vi.fn(), showLoading: vi.fn(), success: vi.fn(), error: vi.fn() };
    mockAspRoleS = { roleSignal: vi.fn(() => signal(null)) };
    mockTableScrollHeightS = { scrollHeight: signal('400px') };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [UnifiedPendingDashboard, NoopAnimationsModule],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
        { provide: Router, useValue: mockRouter },
        { provide: AiService, useValue: mockAiService },
        { provide: SwalService, useValue: mockSwalService },
        { provide: AspRoleService, useValue: mockAspRoleS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
        { provide: MessageService, useValue: { add: vi.fn() } },
      ],
    });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(UnifiedPendingDashboard);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with empty data and loading false', () => {
    expect(component.data().length).toBe(0);
    expect(component.loading()).toBe(false);
  });

  it('should load data when customerId is set', async () => {
    const mockItems = [
      { id: '1', module: 'Tickets', title: 'Test', status: 'Pendiente', date: '2024-01-01', formattedDate: '01/01/2024', responsible: 'User', urlRoute: '/test', priority: 1 },
    ];
    mockApiResponseS.onGetList.mockResolvedValue(mockItems);

    mockCustomerIdS.customerId.set('cust-456');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.loadedCustomerId()).toBe('cust-456');
    expect(component.allData.length).toBe(1);
    expect(component.data().length).toBe(1);
  });

  it('should filter data by selected module', () => {
    component.allData = [
      { id: '1', module: 'Tickets', title: 'Ticket 1', status: 'Pendiente', date: '2024-01-01', formattedDate: '01/01/2024', responsible: 'User', urlRoute: '/test', priority: 1 },
      { id: '2', module: 'Minutas', title: 'Minuta 1', status: 'Pendiente', date: '2024-01-01', formattedDate: '01/01/2024', responsible: 'User', urlRoute: '/test', priority: 2 },
    ];
    component.selectedModule.set('Tickets');
    component.filterData();
    expect(component.data().length).toBe(1);
    expect(component.data()[0].module).toBe('Tickets');
  });

  it('getSeverity should return correct severity', () => {
    expect(component.getSeverity('concluido')).toBe('success');
    expect(component.getSeverity('activo')).toBe('success');
    expect(component.getSeverity('pendiente')).toBe('warn');
    expect(component.getSeverity('proceso')).toBe('info');
    expect(component.getSeverity('vencido')).toBe('danger');
    expect(component.getSeverity('vener')).toBe('danger');
    expect(component.getSeverity('unknown')).toBe('secondary');
  });

  it('getModuleSeverity should return correct severity', () => {
    expect(component.getModuleSeverity('Tickets')).toBe('info');
    expect(component.getModuleSeverity('Minutas')).toBe('warning');
    expect(component.getModuleSeverity('Mantenimiento')).toBe('success');
    expect(component.getModuleSeverity('Legal')).toBe('danger');
    expect(component.getModuleSeverity('Polizas')).toBe('info');
    expect(component.getModuleSeverity('Bajas')).toBe('danger');
    expect(component.getModuleSeverity('Altas')).toBe('success');
    expect(component.getModuleSeverity('Vacantes')).toBe('info');
    expect(component.getModuleSeverity('Modificaciones')).toBe('warning');
  });

  it('getModuleEmoji should return correct emoji', () => {
    expect(component.getModuleEmoji('Tickets')).toBe('??');
    expect(component.getModuleEmoji('Minutas')).toBe('??');
    expect(component.getModuleEmoji('Mantenimiento')).toBe('??');
    expect(component.getModuleEmoji('Legal')).toBe('??');
    expect(component.getModuleEmoji('Polizas')).toBe('??');
    expect(component.getModuleEmoji('Bajas')).toBe('??');
    expect(component.getModuleEmoji('Altas')).toBe('??');
    expect(component.getModuleEmoji('Vacantes')).toBe('??');
    expect(component.getModuleEmoji('Modificaciones')).toBe('??');
  });

  it('getDaysSinceFollowup should return 0 for non-Tickets/Minutas', () => {
    const item: any = { module: 'Legal', date: '2024-01-01' };
    expect(component.getDaysSinceFollowup(item)).toBe(0);
  });

  it('getDaysSinceFollowup should return positive number for Tickets', () => {
    const item: any = { module: 'Tickets', date: new Date().toISOString() };
    expect(component.getDaysSinceFollowup(item)).toBeGreaterThanOrEqual(0);
  });

  it('isSevere should return true when days > 8', () => {
    const item: any = { module: 'Tickets', date: '2020-01-01' };
    expect(component.isSevere(item)).toBe(true);
  });

  it('isWarning should return true when days between 7 and 8', () => {
    const item: any = { module: 'Tickets', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() };
    expect(component.isWarning(item)).toBe(true);
  });

  it('onNavigate should call router.navigateByUrl when urlRoute exists', () => {
    const item: any = { module: 'Tickets', urlRoute: '/some-route', id: '1' };
    component.onNavigate(item);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/some-route');
  });

  it('sendExecutiveReport should call API', () => {
    mockApiResponseS.onPost.mockResolvedValue(true);
    mockCustomerIdS.customerId.set('cust-123');

    component.sendExecutiveReport();

    expect(mockSwalService.showLoading).toHaveBeenCalled();
    expect(mockApiResponseS.onPost).toHaveBeenCalledWith(
      'Dashboard/SendExecutiveReport/cust-123',
      {},
    );
  });

  it('onModuleFilterChange should update selectedModule and filter', () => {
    component.allData = [
      { id: '1', module: 'Tickets', title: 'Ticket 1', status: 'Pendiente', date: '2024-01-01', formattedDate: '01/01/2024', responsible: 'User', urlRoute: '/test', priority: 1 },
    ];
    component.onModuleFilterChange('Tickets');
    expect(component.selectedModule()).toBe('Tickets');
  });

  it('onModalForm should not throw', () => {
    expect(() => component.onModalForm({})).not.toThrow();
  });
});

