import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { BonoFormComponent } from './components/bono-form/bono-form.component';
import { seguridadGuard } from './guard/seguridad.guard';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'homes',
    component: HomeComponent,
    canActivate: [seguridadGuard]
   // solo construcciones, se debe agregar a cada uno
  },
  {
    path: 'bono-form',
    component: BonoFormComponent,
    canActivate: [seguridadGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
