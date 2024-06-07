import { Routes } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RequestResetComponent } from './components/request-reset/request-reset.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { RegistrationComponent } from './components/registration/registration.component';

export const routes: Routes = [
    { path: 'login', component: LoginFormComponent },
    { path: 'request-reset', component: RequestResetComponent },
    { path: 'change-password', component: ChangePasswordComponent },
    { path: 'register', component: RegistrationComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
