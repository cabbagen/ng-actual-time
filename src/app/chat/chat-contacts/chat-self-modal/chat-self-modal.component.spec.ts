import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSelfModalComponent } from './chat-self-modal.component';

describe('ChatSelfModalComponent', () => {
  let component: ChatSelfModalComponent;
  let fixture: ComponentFixture<ChatSelfModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatSelfModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatSelfModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
