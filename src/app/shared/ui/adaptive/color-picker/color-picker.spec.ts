import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LxColorPicker } from './color-picker';
import { PlatformService } from 'src/app/core/services/platform.service';

describe('LxColorPicker', () => {
  let component: LxColorPicker;
  let fixture: ComponentFixture<LxColorPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LxColorPicker],
      providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LxColorPicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
