export interface Ticket {
  id: string; // Generated UUID
  title: string; // Required, max 100 chars
  description: string; // Required, max 500 chars
  createdDate: string; // Required, dd-mm-yyyy
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'; // Required
  assignedAgent?: string; // Optional
  priority: 'Low' | 'Medium' | 'High'; // For priority indicator
}
