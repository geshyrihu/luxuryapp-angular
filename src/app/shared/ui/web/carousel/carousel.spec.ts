import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Carousel } from './carousel';

describe('Carousel', () => {
  let component: Carousel;
  let fixture: ComponentFixture<Carousel>;

  beforeEach(async () => {
    // ngx-owl-carousel-o no compila bajo JIT (vitest); se sustituye la plantilla.
    TestBed.overrideComponent(Carousel, {
      set: { template: '<div></div>', imports: [] },
    });
    await TestBed.configureTestingModule({
      imports: [Carousel],
    }).compileComponents();

    fixture = TestBed.createComponent(Carousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
