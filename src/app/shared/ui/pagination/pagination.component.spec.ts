import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let fixture: ComponentFixture<PaginationComponent>;
  let component: PaginationComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PaginationComponent] }).compileComponents();
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('total', 14);
    fixture.componentRef.setInput('pageSize', 6);
    fixture.detectChanges();
  });

  it('computes the page count', () => {
    expect(component.pageCount()).toBe(3);
  });

  it('never goes outside the valid page range', () => {
    component.go(99);
    expect(component.page()).toBe(3);
    component.go(-5);
    expect(component.page()).toBe(1);
  });

  it('renders Prev, 3 page buttons and Next', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(5);
  });

  it('moves to page 2 when Next is clicked', () => {
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    buttons[buttons.length - 1].click();
    fixture.detectChanges();
    expect(component.page()).toBe(2);
  });

  it('renders nothing when there is only one page', () => {
    fixture.componentRef.setInput('total', 4);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('nav')).toBeNull();
  });
});