import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { Ticket } from '../../../shared/models/ticket.model';
import { TicketService } from '../../../core/services/ticket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket-dashboard',
  template: `
    <div class="dashboard-container">
      <div class="filters">
        <mat-form-field>
          <mat-label>Filter by Status</mat-label>
          <mat-select (selectionChange)="applyStatusFilter($event.value)">
            <mat-option value="">All</mat-option>
            <mat-option value="Open">Open</mat-option>
            <mat-option value="In Progress">In Progress</mat-option>
            <mat-option value="Resolved">Resolved</mat-option>
            <mat-option value="Closed">Closed</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Filter by Agent</mat-label>
          <mat-select (selectionChange)="applyAgentFilter($event.value)">
            <mat-option value="">All</mat-option>
            <mat-option value="Agent1">Agent 1</mat-option>
            <mat-option value="Agent2">Agent 2</mat-option>
            <mat-option value="Agent3">Agent 3</mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="navigateToAdd()">
          Add Ticket
        </button>
      </div>
      <div class="table-container">
        <table
          mat-table
          [dataSource]="dataSource"
          matSort
          class="mat-elevation-z8"
        >
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Title</th>
            <td mat-cell *matCellDef="let ticket">{{ ticket.title }}</td>
          </ng-container>
          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>
              Description
            </th>
            <td
              mat-cell
              *matCellDef="let ticket"
              matTooltip="{{ ticket.description }}"
              class="description-cell"
            >
              {{ ticket.description }}
            </td>
          </ng-container>
          <ng-container matColumnDef="createdDate">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>
              Created Date
            </th>
            <td mat-cell *matCellDef="let ticket">{{ ticket.createdDate }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
            <td mat-cell *matCellDef="let ticket">{{ ticket.status }}</td>
          </ng-container>
          <ng-container matColumnDef="assignedAgent">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Agent</th>
            <td mat-cell *matCellDef="let ticket">
              {{ ticket.assignedAgent || 'Unassigned' }}
            </td>
          </ng-container>
          <ng-container matColumnDef="priority">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Priority</th>
            <td
              mat-cell
              *matCellDef="let ticket"
              [ngClass]="{
                urgent: ticket.priority === 'High',
                medium: ticket.priority === 'Medium',
                low: ticket.priority === 'Low'
              }"
            >
              {{ ticket.priority }}
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let ticket">
              <button mat-icon-button (click)="editTicket(ticket.id)">
                <mat-icon>edit</mat-icon>
              </button>
              <button
                mat-icon-button
                color="warn"
                (click)="deleteTicket(ticket.id)"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </div>
      <mat-paginator
        [pageSizeOptions]="[5, 10, 20]"
        showFirstLastButtons
      ></mat-paginator>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        padding: 20px;
      }
      .filters {
        display: flex;
        gap: 20px;
        margin-bottom: 20px;
      }
      .table-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      table {
        width: 100%;
        min-width: 800px; /* Minimum width before scrolling kicks in */
        table-layout: fixed;
      }
      th,
      td {
        padding: 8px;
        text-align: left;
      }
      th[mat-header-cell],
      td[mat-cell] {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      th[mat-header-cell='title'],
      td[mat-cell='title'] {
        width: 15%;
      }
      th[mat-header-cell='description'],
      td[mat-cell='description'] {
        width: 30%;
      }
      th[mat-header-cell='createdDate'],
      td[mat-cell='createdDate'] {
        width: 15%;
      }
      th[mat-header-cell='status'],
      td[mat-cell='status'] {
        width: 10%;
      }
      th[mat-header-cell='assignedAgent'],
      td[mat-cell='assignedAgent'] {
        width: 15%;
      }
      th[mat-header-cell='priority'],
      td[mat-cell='priority'] {
        width: 10%;
      }
      th[mat-header-cell='actions'],
      td[mat-cell='actions'] {
        width: 15%;
      }
      .description-cell {
        white-space: normal !important;
        word-wrap: break-word;
        max-height: 100px;
        overflow-y: auto;
      }
      .urgent {
        color: red;
        font-weight: bold;
      }
      .medium {
        color: orange;
        font-weight: bold;
      }
      .low {
        color: green;
        font-weight: bold;
      }
      /* Optional: Add a visual cue for scrollability on mobile */
      @media (max-width: 768px) {
        .table-container {
          box-shadow: inset 10px 0 10px -10px rgba(0, 0, 0, 0.2),
            inset -10px 0 10px -10px rgba(0, 0, 0, 0.2);
        }
      }
    `,
  ],
})
export class TicketDashboardComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'title',
    'description',
    'createdDate',
    'status',
    'assignedAgent',
    'priority',
    'actions',
  ];
  dataSource = new MatTableDataSource<Ticket>();
  allTickets: Ticket[] = [];
  selectedStatus: string = ''; // Track selected status
  selectedAgent: string = ''; // Track selected agent

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private store: Store<{ tickets: { tickets: Ticket[] } }>,
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit() {
    this.ticketService.loadTickets();
    this.store
      .select((state) => state.tickets.tickets)
      .subscribe((tickets) => {
        this.allTickets = tickets;
        this.applyFilters(); // Apply filters initially
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyStatusFilter(status: string) {
    this.selectedStatus = status; // Update selected status
    this.applyFilters(); // Apply combined filters
  }

  applyAgentFilter(agent: string) {
    this.selectedAgent = agent; // Update selected agent
    this.applyFilters(); // Apply combined filters
  }

  private applyFilters() {
    let filteredTickets = [...this.allTickets]; // Start with all tickets

    // Apply status filter if selected
    if (this.selectedStatus) {
      filteredTickets = filteredTickets.filter(
        (ticket) => ticket.status === this.selectedStatus
      );
    }

    // Apply agent filter if selected
    if (this.selectedAgent) {
      filteredTickets = filteredTickets.filter(
        (ticket) => ticket.assignedAgent === this.selectedAgent
      );
    }

    this.dataSource.data = filteredTickets; // Update data source with combined filters

    // Reset paginator to the first page after filtering
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  navigateToAdd() {
    this.router.navigate(['/tickets/add']);
  }

  editTicket(id: string) {
    this.router.navigate(['/tickets/edit', id]);
  }

  deleteTicket(id: string) {
    if (confirm('Are you sure you want to delete this ticket?')) {
      this.ticketService.deleteTicket(id);
    }
  }
}
