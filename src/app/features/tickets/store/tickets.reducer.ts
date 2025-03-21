import { createReducer, on } from '@ngrx/store';
import { Ticket } from '../../../shared/models/ticket.model';
import * as TicketActions from './tickets.actions';

export interface TicketState {
  tickets: Ticket[];
}

const initialState: TicketState = {
  tickets: JSON.parse(localStorage.getItem('tickets') || '[]'),
};

export const ticketReducer = createReducer(
  initialState,
  on(TicketActions.addTicket, (state, { ticket }) => {
    const updatedTickets = [...state.tickets, ticket];
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
    return { ...state, tickets: updatedTickets };
  }),
  on(TicketActions.updateTicket, (state, { ticket }) => {
    const updatedTickets = state.tickets.map((t) =>
      t.id === ticket.id ? ticket : t
    );
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
    return { ...state, tickets: updatedTickets };
  }),
  on(TicketActions.deleteTicket, (state, { id }) => {
    const updatedTickets = state.tickets.filter((t) => t.id !== id);
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
    return { ...state, tickets: updatedTickets };
  }),
  on(TicketActions.loadTicketsSuccess, (state, { tickets }) => ({
    ...state,
    tickets,
  }))
);
