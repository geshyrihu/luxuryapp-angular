import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { Router } from '@angular/router';
import { SupervisionAccountingHub } from './master-dashboard';

describe('SupervisionAccountingHub', () => {
  let component: SupervisionAccountingHub;
  let fixture: ComponentFixture<SupervisionAccountingHub>;
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = { navigateByUrl: vi.fn() };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(SupervisionAccountingHub, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [SupervisionAccountingHub],
      providers: [
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(SupervisionAccountingHub);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getVisibleGroups should return SUPERVISION_MODULES', () => {
    const groups = component.getVisibleGroups();
    expect(groups).toBeDefined();
    expect(groups.length).toBeGreaterThan(0);
    expect(groups[0].label).toBe('Agenda y Minutas');
  });

  it('navigateTo should call router.navigateByUrl', () => {
    component.navigateTo('/test-route');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/test-route');
  });
});
