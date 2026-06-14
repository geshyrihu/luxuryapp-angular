import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PageTitleReportMaintenance } from './page-title-report-maintenance';

describe('PageTitleReportMaintenance', () => {
  let component: PageTitleReportMaintenance;
  let fixture: ComponentFixture<PageTitleReportMaintenance>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PageTitleReportMaintenance],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(PageTitleReportMaintenance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty breadcrumb items by default', () => {
    expect(component.breadcrumbItems()).toEqual([]);
  });

  it('should have undefined title by default', () => {
    expect(component.title()).toBeUndefined();
  });

  it('should render title when provided', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.detectChanges();
    const h4 = fixture.nativeElement.querySelector('h4');
    expect(h4.textContent).toContain('Test Title');
  });

  it('should render breadcrumb items when provided', () => {
    const items = [
      { label: 'Home', active: false },
      { label: 'settings', active: true },
    ];
    fixture.componentRef.setInput('breadcrumbItems', items);
    fixture.detectChanges();
    const lis = fixture.nativeElement.querySelectorAll('li');
    expect(lis.length).toBe(2);
    expect(lis[1].classList).toContain('active');
  });
});
