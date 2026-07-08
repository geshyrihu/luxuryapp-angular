import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LxCarousel } from './carousel';
import { PlatformService } from 'src/app/core/services/platform.service';

describe('LxCarousel', () => {
  let component: LxCarousel;
  let fixture: ComponentFixture<LxCarousel>;

  beforeEach(async () => {
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
