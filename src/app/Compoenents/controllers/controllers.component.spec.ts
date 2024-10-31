import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllersComponent } from './controllers.component';

describe('ControllersComponent', () => {
  let component: ControllersComponent;
  let fixture: ComponentFixture<ControllersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControllersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControllersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
