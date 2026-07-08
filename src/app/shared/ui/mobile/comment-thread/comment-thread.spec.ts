import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileCommentThread } from './comment-thread';

describe('MobileCommentThread', () => {
  let component: MobileCommentThread;
  let fixture: ComponentFixture<MobileCommentThread>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileCommentThread],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileCommentThread);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
