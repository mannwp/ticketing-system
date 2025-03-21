import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from '../../../core/services/ticket.service';
import { v4 as uuidv4 } from 'uuid';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Ticket } from '../../../shared/models/ticket.model';

@Component({
  selector: 'app-ticket-form',
  template: `
    <form [formGroup]="ticketForm" (ngSubmit)="onSubmit()" class="ticket-form">
      <mat-form-field>
        <mat-label>Ticket Title</mat-label>
        <input matInput formControlName="title" maxlength="100" required />
        <mat-error *ngIf="ticketForm.get('title')?.hasError('required')"
          >Title is required</mat-error
        >
        <mat-error *ngIf="ticketForm.get('title')?.hasError('maxlength')"
          >Max 100 characters</mat-error
        >
      </mat-form-field>
      <mat-form-field>
        <mat-label>Description</mat-label>
        <textarea
          matInput
          formControlName="description"
          maxlength="500"
          required
        ></textarea>
        <mat-error *ngIf="ticketForm.get('description')?.hasError('required')"
          >Description is required</mat-error
        >
        <mat-error *ngIf="ticketForm.get('description')?.hasError('maxlength')"
          >Max 500 characters</mat-error
        >
      </mat-form-field>
      <mat-form-field>
        <mat-label>Status</mat-label>
        <mat-select formControlName="status" required>
          <mat-option value="Open">Open</mat-option>
          <mat-option value="In Progress">In Progress</mat-option>
          <mat-option value="Resolved">Resolved</mat-option>
          <mat-option value="Closed">Closed</mat-option>
        </mat-select>
        <mat-error *ngIf="ticketForm.get('status')?.hasError('required')"
          >Status is required</mat-error
        >
      </mat-form-field>
      <mat-form-field>
        <mat-label>Assigned Agent</mat-label>
        <mat-select formControlName="assignedAgent">
          <mat-option value="">None</mat-option>
          <mat-option value="Agent1">Agent 1</mat-option>
          <mat-option value="Agent2">Agent 2</mat-option>
          <mat-option value="Agent3">Agent 3</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Priority</mat-label>
        <mat-select formControlName="priority" required>
          <mat-option value="Low">Low</mat-option>
          <mat-option value="Medium">Medium</mat-option>
          <mat-option value="High">High</mat-option>
        </mat-select>
      </mat-form-field>
      <div class="form-actions">
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="ticketForm.invalid"
        >
          {{ ticketId ? 'Update' : 'Create' }}
        </button>
        <button mat-raised-button color="warn" type="button" (click)="cancel()">
          Cancel
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .ticket-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        max-width: 500px;
        margin: 20px auto;
      }
      .form-actions {
        display: flex;
        gap: 10px;
      }
    `,
  ],
})
export class TicketFormComponent implements OnInit {
  ticketForm: FormGroup;
  ticketId?: string;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<{ tickets: { tickets: Ticket[] } }>
  ) {
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      status: ['Open', Validators.required],
      assignedAgent: [''],
      priority: ['Medium', Validators.required],
    });
  }

  ngOnInit() {
    this.ticketId = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.ticketId) {
      this.store
        .select((state) => state.tickets.tickets)
        .subscribe((tickets) => {
          const ticket = tickets.find((t) => t.id === this.ticketId);
          if (ticket) {
            this.ticketForm.patchValue({
              title: ticket.title,
              description: ticket.description,
              status: ticket.status,
              assignedAgent: ticket.assignedAgent || '',
              priority: ticket.priority,
            });
          }
        });
    }
  }

  onSubmit() {
    if (this.ticketForm.valid) {
      const ticket: Ticket = {
        id: this.ticketId || uuidv4(),
        createdDate: this.ticketId
          ? this.getExistingCreatedDate()
          : new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
        ...this.ticketForm.value,
      };
      if (this.ticketId) {
        this.ticketService.updateTicket(ticket);
      } else {
        this.ticketService.addTicket(ticket);
      }
      this.router.navigate(['/tickets']);
    }
  }

  cancel() {
    this.router.navigate(['/tickets']);
  }

  private getExistingCreatedDate(): string {
    let createdDate = '';
    this.store
      .select((state) => state.tickets.tickets)
      .subscribe((tickets) => {
        const ticket = tickets.find((t) => t.id === this.ticketId);
        createdDate = ticket?.createdDate || '';
      });
    return createdDate;
  }
}
