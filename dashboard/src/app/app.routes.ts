import { Routes } from '@angular/router';
import { OverviewComponent } from './features/overview/overview.component';
import { DocumentationComponent } from './features/documentation/documentation.component';
import { SummariesComponent } from './features/summaries/summaries.component';
import { SettingsComponent } from './features/settings/settings.component';

export const routes: Routes = [
    { path: '', redirectTo: '/overview', pathMatch: 'full' },
    { path: 'overview', component: OverviewComponent },
    { path: 'documentation', component: DocumentationComponent },
    { path: 'summaries', component: SummariesComponent },
    { path: 'settings', component: SettingsComponent },
    { path: '**', redirectTo: '/overview' }
];
