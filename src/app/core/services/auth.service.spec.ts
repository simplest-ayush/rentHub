import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('starts logged out', () => {
    expect(service.isLoggedIn()).toBe(false);
    expect(service.user()).toBeNull();
  });

  it('logs in the seeded demo user', () => {
    const result = service.login('demo@renthub.com', 'Demo@123');
    expect(result.ok).toBe(true);
    expect(service.isLoggedIn()).toBe(true);
    expect(service.user()?.name).toBe('Demo Landlord');
  });

  it('rejects a wrong password', () => {
    const result = service.login('demo@renthub.com', 'wrong');
    expect(result.ok).toBe(false);
    expect(result.error).toBe('Invalid email or password');
    expect(service.isLoggedIn()).toBe(false);
  });

  it('registers a new user and starts a session', () => {
    const result = service.register('Asha', 'asha@test.com', 'secret1');
    expect(result.ok).toBe(true);
    expect(service.user()?.email).toBe('asha@test.com');
  });

  it('rejects a duplicate email (case-insensitive)', () => {
    service.register('Asha', 'asha@test.com', 'secret1');
    const result = service.register('Other', 'ASHA@test.com', 'secret2');
    expect(result.ok).toBe(false);
    expect(result.error).toBe('Email already registered');
  });

  it('logs out and clears the session', () => {
    service.login('demo@renthub.com', 'Demo@123');
    service.logout();
    expect(service.isLoggedIn()).toBe(false);
    expect(localStorage.getItem('session')).toBe('null');
  });
});