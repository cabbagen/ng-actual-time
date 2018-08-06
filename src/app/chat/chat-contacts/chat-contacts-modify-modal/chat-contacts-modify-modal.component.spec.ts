import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatContactsModifyModalComponent } from './chat-contacts-modify-modal.component';

describe('ChatContactsModifyModalComponent', () => {
  let component: ChatContactsModifyModalComponent;
  let fixture: ComponentFixture<ChatContactsModifyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatContactsModifyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatContactsModifyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
