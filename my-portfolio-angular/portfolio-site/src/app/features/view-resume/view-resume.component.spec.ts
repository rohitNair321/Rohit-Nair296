import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '../../shared/shared.module';

import { ViewResumeComponent } from './view-resume.component';

describe('ViewResumeComponent', () => {
  let component: ViewResumeComponent;
  let fixture: ComponentFixture<ViewResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewResumeComponent ],
      imports: [HttpClientTestingModule, SharedModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
