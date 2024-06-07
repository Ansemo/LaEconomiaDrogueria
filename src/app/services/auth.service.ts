import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { delay, map, Observable, of } from 'rxjs';
import { SuccessSnackBarComponent } from '../components/success-snack-bar/success-snack-bar.component';
import { ErrorSnackBarComponent } from '../components/error-snack-bar/error-snack-bar.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users = [
    {
      email: 'pain@ejemplo.com',
      password: '123',
      resetToken: null,
      verificationCode: null,
    },
    {
      email: 'seguraandres508@gmail.com',
      password: 'password123',
      resetToken: null,
      verificationCode: null,
    },
  ];

  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string) {
    this.snackBar.openFromComponent(SuccessSnackBarComponent, {
      data: message,
      duration: 3000,
      panelClass: ['custom-snack-bar'],
    });
  }

  showError(message: string) {
    this.snackBar.openFromComponent(ErrorSnackBarComponent, {
      data: message,
      duration: 3000,
      panelClass: ['custom-snack-bar'],
    });
  }

  login(username: string, password: string): Observable<boolean> {
    return of({ username, password }).pipe(
      delay(1000),
      map((credentials) =>
        this.users.some(
          (user) =>
            user.email === credentials.username &&
            user.password === credentials.password
        )
      )
    );
  }

  checkEmailExists(email: string): Observable<boolean> {
    return of(email).pipe(
      delay(500),
      map((emailToCheck) =>
        this.users.some((user) => user.email === emailToCheck)
      )
    );
  }

  generateResetToken(email: string): Observable<string> {
    const token = Math.random().toString(36).substring(2);
    return of(email).pipe(
      delay(500),
      map((emailToCheck) => {
        const user: any = this.users.find(
          (user) => user.email === emailToCheck
        );
        if (user) {
          user.resetToken = token;
          console.log('Token generado:', token);
          console.log('Usuario después de asignar token:', user);
          return token;
        }
        throw new Error('Usuario no encontrado');
      })
    );
  }

  validateResetToken(email: string, token: string): Observable<boolean> {
    return of(email).pipe(
      delay(500),
      map((emailToCheck) => {
        const user = this.users.find((user) => user.email === emailToCheck);
        if (user) {
          console.log('Validando token:', token);
          console.log('Token almacenado del usuario:', user.resetToken);
          return user.resetToken === token;
        }
        return false;
      })
    );
  }

  generateVerificationCode(email: string): Observable<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return of(email).pipe(
      delay(500),
      map((emailToCheck) => {
        const user: any = this.users.find(
          (user) => user.email === emailToCheck
        );
        if (user) {
          user.verificationCode = code;
          return code;
        }
        throw new Error('Usuario no encontrado');
      })
    );
  }

  validateVerificationCode(email: string, code: string): Observable<boolean> {
    return of(email).pipe(
      delay(500),
      map((emailToCheck) => {
        const user = this.users.find((user) => user.email === emailToCheck);
        if (user) {
          return user.verificationCode === code;
        }
        return false;
      })
    );
  }

  changePassword(email: string, newPassword: string): Observable<boolean> {
    return of(email).pipe(
      delay(500),
      map((emailToCheck) => {
        const user = this.users.find((user) => user.email === emailToCheck);
        if (user) {
          user.password = newPassword;
          user.resetToken = null;
          user.verificationCode = null;
          return true;
        }
        return false;
      })
    );
  }

  addUser(user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    documentType: string;
    documentNumber: string;
    gender: string;
    birthDate: string;
    password: string;
  }): Observable<boolean> {
    return of(user).pipe(
      delay(500),
      map((newUser: any) => {
        if (
          this.users.some(
            (existingUser) => existingUser.email === newUser.email
          )
        ) {
          throw new Error('El usuario ya existe');
        }
        this.users.push(newUser);
        return true;
      })
    );
  }
}
