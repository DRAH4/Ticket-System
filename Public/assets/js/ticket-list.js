// ticket-list.js
'use strict';

// Temporary ticket data (will be removed once the database is made)
const tickets = [
  {
    id: 1,
    subject: 'Full Stack Project: Ticketing System',
    createdAt: '09/12/2025',
    priority: 'High',
    assignee: 'Jon Snow',
    type: 'Bug Fix',
    status: 'Pending',
    owner: 'John Doe'
  },
  {
    id: 2,
    subject: 'Help with new computer',
    createdAt: '10/15/2025',
    priority: 'P1',
    assignee: 'Booker DeWitt',
    type: 'IT Issue',
    status: 'Open',
    owner: 'Jane Smith'
  },
  {
    id: 3,
    subject: 'Help with new computer',
    createdAt: '10/11/2025',
    priority: 'Low',
    assignee: 'Booker DeWitt',
    type: 'IT Issue',
    status: 'Open',
    owner: 'Jane Smith'
  },
  {
    id: 4,
    subject: 'Help with new computer',
    createdAt: '08/15/2025',
    priority: 'Medium',
    assignee: 'Booker DeWitt',
    type: 'IT Issue',
    status: 'Open',
    owner: 'Jane Smith'
  }
];

function renderTickets(list = tickets) {
  const tbody = document.getElementById('ticket-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  list.forEach(ticket => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td class="control dtr-hidden" tabindex="0" style="display: none;"></td>
      <td><span>#${ticket.id}</span></td>
      <td><span class="ticket-subject">${ticket.subject}</span></td>
      <td><span>${ticket.createdAt}</span></td>
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


document.addEventListener('DOMContentLoaded', () => {

  renderTickets(tickets);

  const btnOldest = document.getElementById('filter-oldest');
  const btnHigh = document.getElementById('filter-high');
  const btnOpen = document.getElementById('filter-open');
  // UNREAD IS NOT READY YET
  //const btnUnread = document.getElementById('filter-unread');

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

// Function for all lower filters
function applyFilters() {
  const type = filterType ? filterType.value : '';
  const status = filterStatus ? filterStatus.value : '';
  const owner = filterOwner ? filterOwner.value : '';
  const priority = filterPriority ? filterPriority.value : '';
  const assignee = filterAssignee ? filterAssignee.value : '';

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