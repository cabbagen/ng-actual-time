import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatContactsItemComponent } from './chat-contacts-item.component';

describe('ChatContactsItemComponent', () => {
  let component: ChatContactsItemComponent;
  let fixture: ComponentFixture<ChatContactsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatContactsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatContactsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
