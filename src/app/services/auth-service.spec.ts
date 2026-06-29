import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth-service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(AuthService);

    // Browser-Speicher vor jedem Test leeren,
    // damit alte Login-Daten den Test nicht beeinflussen.
    localStorage.clear();
  });

  it('sollte erstellt werden', () => {
    expect(service).toBeTruthy();
  });

  it('sollte am Anfang nicht eingeloggt sein', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('sollte sich mit richtigen Login-Daten einloggen', () => {
    const loginErfolgreich = service.login('tim', '123');

    expect(loginErfolgreich).toBe(true);
    expect(service.isLoggedIn()).toBe(true);
  });

  it('sollte falsche Login-Daten ablehnen', () => {
    const loginErfolgreich = service.login('falsch', '000');

    expect(loginErfolgreich).toBe(false);
    expect(service.isLoggedIn()).toBe(false);
  });

  it('sollte sich wieder ausloggen', () => {
    service.login('tim', '123');

    service.logout();

    expect(service.isLoggedIn()).toBe(false);
  });
});


//import { TestBed } from '@angular/core/testing';
//import { AuthService } from './auth-service';
//describe('AuthService', () => {
//  let service: AuthService;
//  beforeEach(() => {
//    TestBed.configureTestingModule({});
//    service = TestBed.inject(AuthService);
//  });
//  it('should be created', () => {
//    expect(service).toBeTruthy();
//  });
//});
