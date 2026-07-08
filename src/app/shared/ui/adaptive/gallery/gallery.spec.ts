import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LxGallery } from './gallery';
import { PlatformService } from 'src/app/core/services/platform.service';

describe('LxGallery', () => {
  let component: LxGallery;
  let fixture: ComponentFixture<LxGallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LxGallery],
      providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LxGallery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
