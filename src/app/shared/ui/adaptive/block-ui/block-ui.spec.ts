import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LxBlockUI } from './block-ui';
import { PlatformService } from 'src/app/core/services/platform.service';

describe('LxBlockUI', () => {
  let component: LxBlockUI;
  let fixture: ComponentFixture<LxBlockUI>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LxBlockUI],
      providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LxBlockUI);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
