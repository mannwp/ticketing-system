import { createAction, props } from '@ngrx/store';
import { Ticket } from '../../../shared/models/ticket.model';

export const addTicket = createAction(
  '[Tickets] Add Ticket',
  props<{ ticket: Ticket }>()
);
export const updateTicket = createAction(
  '[Tickets] Update Ticket',
  props<{ ticket: Ticket }>()
);
export const deleteTicket = createAction(
  '[Tickets] Delete Ticket',
  props<{ id: string }>()
);
export const loadTickets = createAction('[Tickets] Load Tickets');
export const loadTicketsSuccess = createAction(
  '[Tickets] Load Tickets Success',
  props<{ tickets: Ticket[] }>()
);
