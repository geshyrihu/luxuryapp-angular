import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LxFluid } from './fluid';
import { PlatformService } from 'src/app/core/services/platform.service';

describe('LxFluid', () => {
  let component: LxFluid;
  let fixture: ComponentFixture<LxFluid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LxFluid],
      providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LxFluid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
