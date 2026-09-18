import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LxBreadcrumbs } from './breadcrumbs';
import { PlatformService } from '@core/services/platform.service';

describe('LxBreadcrumbs', () => {
  let component: LxBreadcrumbs;
  let fixture: ComponentFixture<LxBreadcrumbs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LxBreadcrumbs],
      providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LxBreadcrumbs);
    fixture.componentRef.setInput('items', [{ label: 'Inicio' }]);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

