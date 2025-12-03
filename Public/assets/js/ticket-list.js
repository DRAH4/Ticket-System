/**
 * Ticket List
 */

'use strict';

// Javascript to handle the Ticket List page

// Ticket array 
let tickets = [];

// Render tickets into the table body
function renderTickets(list = tickets) {
  const tbody = document.getElementById('ticket-table-body');
  if (!tbody) return;

  // Clear any existing rows
  tbody.innerHTML = '';

  // Build a row for each ticket
  list.forEach(ticket => {
    const tr = document.createElement('tr');

    // Attach ticket id to the row so it can be used for navigation
    tr.setAttribute('data-ticket-id', ticket.id);
    tr.classList.add('ticket-row');

    // Format created date
    function formatDate(dateString) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US").format(date);
    }

    // Generate HTML
    tr.innerHTML = `
      <td class="control dtr-hidden" tabindex="0" style="display: none;"></td>
      <td><span>#${ticket.id}</span></td>
      <td><span class="ticket-subject">${ticket.subject}</span></td>
      <td><span>${formatDate(ticket.createdAt)}</span></td>
      <td>
        <select class="form-select btn-primary btn">
          <option value="P1" ${ticket.priority === 'P1' ? 'selected' : ''}>P1</option>
          <option value="Critical" ${ticket.priority === 'Critical' ? 'selected' : ''}>Critical</option>
          <option value="High" ${ticket.priority === 'High' ? 'selected' : ''}>High</option>
          <option value="Medium" ${ticket.priority === 'Medium' ? 'selected' : ''}>Medium</option>
          <option value="Low" ${ticket.priority === 'Low' ? 'selected' : ''}>Low</option>
          <option value="Request" ${ticket.priority === 'Request' ? 'selected' : ''}>Request</option>
        </select>
      </td>
      <td>
        <select class="form-select btn-primary btn">
          <option value="Jon Snow" ${ticket.assignee === 'Jon Snow' ? 'selected' : ''}>Jon Snow</option>
          <option value="Booker DeWitt" ${ticket.assignee === 'Booker DeWitt' ? 'selected' : ''}>Booker DeWitt</option>
          <option value="Aiden Pearce" ${ticket.assignee === 'Aiden Pearce' ? 'selected' : ''}>Aiden Pearce</option>
          <option value="John Price" ${ticket.assignee === 'John Price' ? 'selected' : ''}>John Price</option>
        </select>
      </td>
      <td>
        <select class="form-select btn-primary btn">
          <option value="Bug Fix" ${ticket.type === 'Bug Fix' ? 'selected' : ''}>Bug Fix</option>
          <option value="Testing" ${ticket.type === 'Testing' ? 'selected' : ''}>Testing</option>
          <option value="Programming" ${ticket.type === 'Programming' ? 'selected' : ''}>Programming</option>
          <option value="Sprint" ${ticket.type === 'Sprint' ? 'selected' : ''}>Sprint</option>
          <option value="IT Issue" ${ticket.type === 'IT Issue' ? 'selected' : ''}>IT Issue</option>
        </select>
      </td>
      <td>
        <select class="form-select btn-primary btn">
          <option value="Pending" ${ticket.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Open" ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
          <option value="Closed" ${ticket.status === 'Closed' ? 'selected' : ''}>Closed</option>
          <option value="Unread" ${ticket.status === 'Unread' ? 'selected' : ''}>Unread</option>
          <option value="Waiting Response" ${ticket.status === 'Waiting Response' ? 'selected' : ''}>Waiting Response</option>
        </select>
      </td>
      <td><span>${ticket.owner}</span></td>
    `;

    tbody.appendChild(tr);
  });
}

// Load tickets from the backend API
async function loadTickets() {
  try {
    const res = await fetch("/api/tickets");
    if (!res.ok) {
      console.error("Failed to load tickets:", res.status);
      return;
    }
    tickets = await res.json();
    renderTickets(tickets);
  } catch (err) {
    console.error("Error loading tickets:", err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Initial load from the API
  loadTickets();

  const tbody = document.getElementById('ticket-table-body');
  if (tbody) {
    // Handle clicking on a ticket row to go to the view page
    tbody.addEventListener('click', (e) => {
      // Ignore clicks on interactive elements so dropdowns still work
      const interactive = e.target.closest('select, button, a, input, label, textarea');
      if (interactive) {
        return;
      }

      // Find the closest row with a ticket id
      const row = e.target.closest('tr[data-ticket-id]');
      if (!row) return;

      const ticketId = row.getAttribute('data-ticket-id');

      // Navigate to the ticket view page with the id in the query string
      window.location.href = `pages/ticket-view.html?id=${ticketId}`;
    });
  }

  // Quick filter buttons
  const btnOldest = document.getElementById('filter-oldest');
  const btnHigh = document.getElementById('filter-high');
  const btnOpen = document.getElementById('filter-open');

  // Dropdown filters
  const filterType = document.getElementById('ticket-type');
  const filterStatus = document.getElementById('ticket-status');
  const filterOwner = document.getElementById('ticket-owner');
  const filterPriority = document.getElementById('ticket-priority');
  const filterAssignee = document.getElementById('ticket-assignee');

  // Oldest Tickets: sort by createdAt ascending
  if (btnOldest) {
    btnOldest.addEventListener('click', () => {
      const sorted = [...tickets].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      renderTickets(sorted);
    });
  }

  // High Priority: P1, Critical, or High
  if (btnHigh) {
    btnHigh.addEventListener('click', () => {
      const filtered = tickets.filter(ticket =>
        ticket.priority === 'P1' ||
        ticket.priority === 'Critical' ||
        ticket.priority === 'High'
      );
      renderTickets(filtered);
    });
  }

  // Open Tickets: status === 'Open'
  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      const filtered = tickets.filter(t => t.status === 'Open');
      renderTickets(filtered);
    });
  }

  // Apply all lower dropdown filters together
  function applyFilters() {
    const type = filterType ? filterType.value : '';
    const status = filterStatus ? filterStatus.value : '';
    const owner = filterOwner ? filterOwner.value : '';
    const priority = filterPriority ? filterPriority.value : '';
    const assignee = filterAssignee ? filterAssignee.value : '';

    // Only keep tickets that match all active filter values
    const filtered = tickets.filter(ticket => {
      if (type && ticket.type !== type) return false;
      if (status && ticket.status !== status) return false;
      if (owner && ticket.owner !== owner) return false;
      if (priority && ticket.priority !== priority) return false;
      if (assignee && ticket.assignee !== assignee) return false;
      return true;
    });

    renderTickets(filtered);
  }

  // Attach change listeners to dropdown filters
  if (filterType) {
    filterType.addEventListener('change', applyFilters);
  }

  if (filterStatus) {
    filterStatus.addEventListener('change', applyFilters);
  }

  if (filterOwner) {
    filterOwner.addEventListener('change', applyFilters);
  }

  if (filterPriority) {
    filterPriority.addEventListener('change', applyFilters);
  }

  if (filterAssignee) {
    filterAssignee.addEventListener('change', applyFilters);
  }
});