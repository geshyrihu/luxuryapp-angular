import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LxOrgChart } from './org-chart';
import { PlatformService } from 'src/app/core/services/platform.service';

describe('LxOrgChart', () => {
  let component: LxOrgChart;
  let fixture: ComponentFixture<LxOrgChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LxOrgChart],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: PlatformService, useValue: { isMobile: () => false } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LxOrgChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
