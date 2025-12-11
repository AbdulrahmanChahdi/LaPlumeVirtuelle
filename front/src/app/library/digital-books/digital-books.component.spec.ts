import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalBooksComponent } from './digital-books.component';

describe('DigitalBooksComponent', () => {
  let component: DigitalBooksComponent;
  let fixture: ComponentFixture<DigitalBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DigitalBooksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DigitalBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
