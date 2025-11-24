/**
 * Ticket View
 */

'use strict';

// Javascript to handle the Ticket View page

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get('id');
  if (!idParam) return;

  const ticketId = Number(idParam);

  // Get tickets from localStorage
  const stored = localStorage.getItem('tickets');
  if (!stored) return;

  let tickets = JSON.parse(stored);

  // Find the ticket by Id
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;

  // Make sure comments exists
  ticket.comments = ticket.comments || [];

  const element = id => document.getElementById(id);

  // Load in the data from storage to their respective elements
  if (element('view-id')) element('view-id').textContent = `#${ticket.id}`;
  if (element('view-title')) element('view-title').textContent = ticket.subject;
  if (element('view-type')) element('view-type').textContent = ticket.type;
  if (element('view-owner')) element('view-owner').textContent = ticket.owner;
  if (element('view-assignee')) element('view-assignee').textContent = ticket.assignee;
  if (element('view-created')) element('view-created').textContent = ticket.createdAt;
  if (element('view-status')) element('view-status').textContent = ticket.status;
  if (element('view-priority')) element('view-priority').textContent = ticket.priority;
  if (element('view-description')) element('view-description').textContent = ticket.description || '';

  // Delete Button
  const deleteBtn = document.getElementById('delete-ticket');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      const confirmDelete = confirm('Are you sure you want to delete this ticket?');
      if (!confirmDelete) return;

      tickets = tickets.filter(t => String(t.id) !== String(ticketId));
      localStorage.setItem('tickets', JSON.stringify(tickets));

      window.location.href = '../index.html';
    });
  }

  // Edit Button
  const editBtn = document.getElementById('edit-ticket');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      window.location.href = `ticket-edit.html?id=${ticketId}`;
    });
  }

  // Comments
  const commentsContainer = document.getElementById('comments-container');
  const commentForm = document.getElementById('comment-form');
  const commentText = document.getElementById('comment-text');

  function renderComments() {
    if (!commentsContainer) return;

    commentsContainer.innerHTML = '';

    ticket.comments.forEach(c => {
      const div = document.createElement('div');
      div.classList.add('d-flex', 'align-items-start', 'mb-3');

      div.innerHTML = `
        <div>
          <h6 class="mb-1">
            ${c.author}
            <small class="text-muted">• ${c.date}</small>
          </h6>
          <p class="mb-2">${c.text}</p>
        </div>
      `;

      commentsContainer.appendChild(div);
    });
  }

  // Initial render for comments
  renderComments();

  if (commentForm && commentText) {
    commentForm.addEventListener('submit', e => {
      e.preventDefault();

      const text = commentText.value.trim();
      if (!text) return;

      const newComment = {
        author: 'John Doe',
        text: text,
        date: new Date().toLocaleString()
      };

      // Update in memory
      ticket.comments.push(newComment);

      // Update tickets array
      tickets = tickets.map(t => (t.id === ticket.id ? ticket : t));

      // Save back to localStorage
      localStorage.setItem('tickets', JSON.stringify(tickets));

      // Rerender new comments
      renderComments();

      // Clear textarea
      commentText.value = '';
    });
  }
});
