import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MobileMessage } from './message';

describe('MobileMessage', () => {
  let component: MobileMessage;
  let fixture: ComponentFixture<MobileMessage>;

  beforeEach(() => {
    TestBed.overrideComponent(MobileMessage, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [MobileMessage],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(MobileMessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
