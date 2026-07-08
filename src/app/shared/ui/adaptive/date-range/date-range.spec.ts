import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LxDateRange } from './date-range';
import { PlatformService } from 'src/app/core/services/platform.service';

describe('LxDateRange', () => {
  let component: LxDateRange;
  let fixture: ComponentFixture<LxDateRange>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LxDateRange],
      providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LxDateRange);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
