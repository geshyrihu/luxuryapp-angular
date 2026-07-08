import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PickList } from './pick-list';

describe('PickList', () => {
  let component: PickList;
  let fixture: ComponentFixture<PickList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickList],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PickList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
