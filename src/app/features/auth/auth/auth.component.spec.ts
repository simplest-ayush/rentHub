import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { AuthComponent } from './auth.component';

describe('AuthComponent', () => {
  let fixture: ComponentFixture<AuthComponent>;
  let component: AuthComponent;
  let router: Router;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [AuthComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows the login form by default', () => {
    expect(component.mode()).toBe('login');
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('Login');
  });

  it('shows validation errors when submitting an empty login form', () => {
    component.onLogin();
    fixture.detectChanges();
    expect(component.loginForm.invalid).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Email is required');
    expect(fixture.nativeElement.textContent).toContain('Password is required');
  });

  it('rejects an invalid email format', () => {
    component.loginForm.patchValue({ email: 'abc', password: 'x' });
    expect(component.loginForm.controls.email.hasError('pattern')).toBe(true);
  });

  it('shows an error for wrong credentials', () => {
    component.loginForm.setValue({ email: 'demo@renthub.com', password: 'nope' });
    component.onLogin();
    fixture.detectChanges();
    expect(component.loginError()).toBe('Invalid email or password');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('logs in the demo user and navigates home', () => {
    component.loginForm.setValue({ email: 'demo@renthub.com', password: 'Demo@123' });
    component.onLogin();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });
});