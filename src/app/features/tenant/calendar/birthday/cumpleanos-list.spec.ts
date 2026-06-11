import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { vi } from 'vitest';
import { Cumpleanos } from './cumpleanos-list';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';

vi.mock('ng2-pdf-viewer', () => ({ PdfViewerModule: class {} }));

let customerIdSignal: ReturnType<typeof signal<string>>;

const apiResponseSMock = {
  onGetList: vi.fn().mockResolvedValue([]),
};
const authServiceMock = { applicationUserId: 'user-1' };
const customerIdSMock = {
  get customerId() { return customerIdSignal; },
};
const dialogHandlerSMock = {
  openDialog: vi.fn().mockResolvedValue(true),
  sizeLg: 'lg' as any,
};

describe('Cumpleanos', () => {
  let component: Cumpleanos;
  let fixture: ComponentFixture<Cumpleanos>;

  beforeEach(() => {
    customerIdSignal = signal('');

    TestBed.overrideComponent(Cumpleanos, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [Cumpleanos],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseSMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: CustomerIdService, useValue: customerIdSMock },
        { provide: DialogHandlerService, useValue: dialogHandlerSMock },
      ],
    });

    fixture = TestBed.createComponent(Cumpleanos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default selectedMonth as current month', () => {
    const currentMonth = new Date().getMonth();
    expect(component.selectedMonth()).toBe(currentMonth);
  });

  it('should have 12 months defined', () => {
    expect(component.months.length).toBe(12);
  });

  it('should have empty dataSignal initially', () => {
    expect(component.dataSignal()).toEqual([]);
  });

  it('onMonthSelect should update selectedMonth and call onLoadData', () => {
    const spy = vi.spyOn(component, 'onLoadData');
    component.onMonthSelect(5);
    expect(component.selectedMonth()).toBe(5);
    expect(spy).toHaveBeenCalled();
  });

  it('onMonthSelectMobile should call onMonthSelect with event detail value', () => {
    const spy = vi.spyOn(component, 'onMonthSelect');
    component.onMonthSelectMobile({ detail: { value: 3 } });
    expect(spy).toHaveBeenCalledWith(3);
  });

  it('onLoadData should call apiResponseS.onGetList and update dataSignal', async () => {
    customerIdSignal.set('cust-1');
    component.selectedMonth.set(5);
    apiResponseSMock.onGetList.mockResolvedValue([{ name: 'Test' }]);
    component.onLoadData();
    await new Promise(resolve => setTimeout(resolve));
    expect(apiResponseSMock.onGetList).toHaveBeenCalledWith('Birthday/cust-1/5');
    expect(component.dataSignal()).toEqual([{ name: 'Test' }]);
  });
});
