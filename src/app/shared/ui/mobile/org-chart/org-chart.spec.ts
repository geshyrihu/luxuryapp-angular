import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileOrgChart } from './org-chart';

describe('MobileOrgChart', () => {
  let component: MobileOrgChart;
  let fixture: ComponentFixture<MobileOrgChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileOrgChart],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileOrgChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
