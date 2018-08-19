import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatContactsModalComponent } from './chat-contacts-modal.component';

describe('ChatContactsModalComponent', () => {
  let component: ChatContactsModalComponent;
  let fixture: ComponentFixture<ChatContactsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatContactsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatContactsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
