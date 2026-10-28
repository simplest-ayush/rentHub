import { Injectable, computed, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { User } from '../models/models';
import { DEMO_USER } from './seed-data';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private storage = inject(StorageService);
    private _user = signal<User | null>(this.storage.get<User | null>('session', null));

    readonly user = this._user.asReadonly();
    readonly isLoggedIn = computed(() => !!this._user());

    constructor() {
        const users = this.storage.get<User[]>('users', []);
        if (!users.some(u => u.id === DEMO_USER.id)) {
            this.storage.set('users', [...users, DEMO_USER]);
        }
    }

    register(name: string, email: string, password: string): { ok: boolean; error?: string } {
        const users = this.storage.get<User[]>('users', []);
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            return { ok: false, error: 'Email already registered' };
        }
        const user: User = { id: crypto.randomUUID(), name, email, password };
        this.storage.set('users', [...users, user]);
        this.startSession(user);
        return { ok: true };
    }

    login(email: string, password: string): { ok: boolean; error?: string } {
        const user = this.storage
            .get<User[]>('users', [])
            .find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (!user) return { ok: false, error: 'Invalid email or password' };
        this.startSession(user);
        return { ok: true };
    }

    logout(): void {
        this.storage.set('session', null);
        this._user.set(null);
    }

    private startSession(user: User): void {
        this.storage.set('session', user);
        this._user.set(user);
    }
}