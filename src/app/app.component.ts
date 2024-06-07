import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LogoComponent } from './components/logo/logo.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { IllustrationComponent } from './components/illustration/illustration.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LogoComponent,
    LoginFormComponent,
    IllustrationComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'LaEconomiaDrogueria';
}
