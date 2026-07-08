import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileInfiniteScroll } from './infinite-scroll';

describe('MobileInfiniteScroll', () => {
  let component: MobileInfiniteScroll;
  let fixture: ComponentFixture<MobileInfiniteScroll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileInfiniteScroll],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileInfiniteScroll);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
