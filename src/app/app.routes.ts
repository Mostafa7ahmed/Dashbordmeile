import { Routes } from '@angular/router';
import { SyncComponent } from './Compoenents/sync/sync.component';
import { SourceComponent } from './Compoenents/source/source.component';
import { LoginComponent } from './Compoenents/login/login.component';
import { ControllersComponent } from './Compoenents/controllers/controllers.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component:ControllersComponent,
    children: [
      { path: 'meilisearch',loadComponent:()=>import("./Compoenents/meilisearch/meilisearch.component").then(c => c.MeilisearchComponent) },
      { path: 'source', component: SourceComponent },

      { path: 'sync', component: SyncComponent },
    ],
  },
];
