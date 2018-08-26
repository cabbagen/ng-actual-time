import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {} from 'jasmine';
import { UploadInputComponent } from './upload-input.component';

describe('CustomInputComponent', () => {
  let component: UploadInputComponent;
  let fixture: ComponentFixture<UploadInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
