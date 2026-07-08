import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MobileTag } from './tag';

describe('MobileTag', () => {
  let component: MobileTag;
  let fixture: ComponentFixture<MobileTag>;

  beforeEach(() => {
    TestBed.overrideComponent(MobileTag, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [MobileTag],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(MobileTag);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
