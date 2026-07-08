import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LxCommentThread } from './comment-thread';
import { PlatformService } from 'src/app/core/services/platform.service';

describe('LxCommentThread', () => {
  let component: LxCommentThread;
  let fixture: ComponentFixture<LxCommentThread>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LxCommentThread],
      providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LxCommentThread);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
