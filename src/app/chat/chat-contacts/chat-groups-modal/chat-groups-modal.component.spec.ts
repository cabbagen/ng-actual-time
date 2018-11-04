import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatGroupsModalComponent } from './chat-groups-modal.component';

describe('ChatGroupsModalComponent', () => {
  let component: ChatGroupsModalComponent;
  let fixture: ComponentFixture<ChatGroupsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatGroupsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatGroupsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
