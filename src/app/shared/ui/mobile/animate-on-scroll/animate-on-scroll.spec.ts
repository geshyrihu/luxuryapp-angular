import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileAnimateOnScroll } from './animate-on-scroll';

describe('MobileAnimateOnScroll', () => {
  let component: MobileAnimateOnScroll;
  let fixture: ComponentFixture<MobileAnimateOnScroll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileAnimateOnScroll],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileAnimateOnScroll);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
