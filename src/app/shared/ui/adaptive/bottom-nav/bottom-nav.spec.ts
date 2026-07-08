import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LxBottomNav } from './bottom-nav';
import { PlatformService } from 'src/app/core/services/platform.service';

describe('LxBottomNav', () => {
  let component: LxBottomNav;
  let fixture: ComponentFixture<LxBottomNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LxBottomNav],
      providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LxBottomNav);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
