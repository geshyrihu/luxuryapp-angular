import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LxCarousel } from './carousel';
import { PlatformService } from '@core/services/platform.service';

describe('LxCarousel', () => {
  let component: LxCarousel;
  let fixture: ComponentFixture<LxCarousel>;

  beforeEach(async () => {
    // Los carruseles internos (owl/ng-bootstrap) no compilan bajo JIT
    // (vitest); se sustituye la plantilla del wrapper.
    TestBed.overrideComponent(LxCarousel, {
      set: { template: '<div></div>', imports: [] },
    });
    await TestBed.configureTestingModule({
      imports: [LxCarousel],
      providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LxCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

