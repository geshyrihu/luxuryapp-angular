import { vi } from 'vitest';

vi.mock('ng2-pdf-viewer', () => ({ PdfViewerModule: class {} }));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ReportMeeting } from './report-meeting';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { TableScrollHeightService } from 'src/app/core/services/table-scroll-height.service';

describe('ReportMeeting', () => {
  let component: ReportMeeting;
  let fixture: ComponentFixture<ReportMeeting>;
  let mockApiResponseS: any;
  let mockTableScrollHeightS: any;
  let paramsSubject: any;

  beforeEach(() => {
    paramsSubject = of({ customer: 'cust-123', id: 'meeting-456' });
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue(null),
      onGetItem: vi.fn().mockResolvedValue({ nameCustomer: '', photoPath: '' }),
    };
    mockTableScrollHeightS = { scrollHeight: signal('600px') };

    TestBed.overrideComponent(ReportMeeting, { set: { template: '<div>Mock</div>', imports: [] } });
    TestBed.configureTestingModule({
      imports: [ReportMeeting],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
        { provide: ActivatedRoute, useValue: { params: paramsSubject } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ReportMeeting);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signal values', () => {
    expect(component.dataSignal()).toBeNull();
    expect(component.logoCustomer()).toBe('');
    expect(component.nameCustomer()).toBe('');
  });

  it('should set meetingId and customerId from params via effect', () => {
    fixture.detectChanges();
    expect(component.customerId).toBe('cust-123');
    expect(component.meetingId).toBe('meeting-456');
  });

  it('should call loadMeetingData and onLoadCustomer when params arrive', () => {
    fixture.detectChanges();
    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith('Meetings/MeetingReportPdf/meeting-456');
    expect(mockApiResponseS.onGetItem).toHaveBeenCalledWith('Customers/cust-123');
  });

  it('loadMeetingData should set dataSignal from API response', async () => {
    const fakeResult = { minuta: { date: '20-ene.-26 06:00', title: 'Reunion' } };
    mockApiResponseS.onGetList.mockResolvedValue(fakeResult);
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve));
    expect(component.dataSignal()).toEqual(fakeResult);
  });

  it('loadMeetingData should parse date string correctly', async () => {
    const fakeResult = { minuta: { date: '20-ene.-26 06:00', title: 'Reunion' } };
    mockApiResponseS.onGetList.mockResolvedValue(fakeResult);
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve));
    const data = component.dataSignal();
    expect(data.minuta.date instanceof Date).toBe(true);
    expect(data.minuta.date.getFullYear()).toBe(2026);
    expect(data.minuta.date.getMonth()).toBe(0);
    expect(data.minuta.date.getDate()).toBe(20);
  });

  it('onLoadCustomer should set nameCustomer and logoCustomer from API', async () => {
    const fakeCustomer = { nameCustomer: 'Test Corp', photoPath: 'logo.png' };
    mockApiResponseS.onGetItem.mockResolvedValue(fakeCustomer);
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve));
    expect(component.nameCustomer()).toBe('Test Corp');
    expect(component.logoCustomer()).toBe('logo.png');
  });

  it('should handle missing minuta.date gracefully', async () => {
    const fakeResult = { minuta: { title: 'Reunion' } };
    mockApiResponseS.onGetList.mockResolvedValue(fakeResult);
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve));
    expect(component.dataSignal()).toEqual(fakeResult);
  });

  it('should handle null API response in loadMeetingData', async () => {
    mockApiResponseS.onGetList.mockResolvedValue(null);
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve));
    expect(component.dataSignal()).toBeNull();
  });
});
