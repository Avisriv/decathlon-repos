import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReposComponent } from './repos/repos.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/repos',
    pathMatch: 'full',
  },
  {
    path: 'repos',
    component: ReposComponent,
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
