import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LxInplace } from './inplace';
import { PlatformService } from 'src/app/core/services/platform.service';

describe('LxInplace', () => {
  let component: LxInplace;
  let fixture: ComponentFixture<LxInplace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LxInplace],
      providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LxInplace);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
