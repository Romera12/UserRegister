import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UserDetailComponent } from './pages/home/user-detail/user-detail.component';
import { UserListComponent } from './pages/home/user-list/user-list.component';
import { UserFormComponent } from './pages/home/user-form/user-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'usuarios' },
      { path: 'usuarios', component: UserListComponent },
      { path: 'newuser', component: UserFormComponent },
      { path: 'user/:id', component: UserDetailComponent },
      { path: 'update_user/:id', component: UserFormComponent },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
