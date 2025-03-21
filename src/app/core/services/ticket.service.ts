import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Ticket } from '../../shared/models/ticket.model';
import * as TicketActions from '../../features/tickets/store/tickets.actions';

@Injectable({ providedIn: 'root' })
export class TicketService {
  constructor(private store: Store) {}

  addTicket(ticket: Ticket) {
    this.store.dispatch(TicketActions.addTicket({ ticket }));
  }

  updateTicket(ticket: Ticket) {
    this.store.dispatch(TicketActions.updateTicket({ ticket }));
  }

  deleteTicket(id: string) {
    this.store.dispatch(TicketActions.deleteTicket({ id }));
  }

  loadTickets() {
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    this.store.dispatch(TicketActions.loadTicketsSuccess({ tickets }));
  }
}
