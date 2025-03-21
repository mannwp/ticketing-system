import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { ticketReducer } from './store/tickets.reducer';
import { TicketDashboardComponent } from './ticket-dashboard/ticket-dashboard.component';
import { TicketFormComponent } from './ticket-form/ticket-form.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip'; // Add this
import { CdkTableModule } from '@angular/cdk/table';

const routes: Routes = [
  { path: '', component: TicketDashboardComponent },
  { path: 'add', component: TicketFormComponent },
  { path: 'edit/:id', component: TicketFormComponent },
];

@NgModule({
  declarations: [TicketDashboardComponent, TicketFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    StoreModule.forFeature('tickets', ticketReducer),
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule, // Add this
  ],
})
export class TicketsModule {}
