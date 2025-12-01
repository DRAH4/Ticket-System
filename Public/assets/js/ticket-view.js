/**
 * Ticket View
 */

'use strict';

// Javascript to handle the Ticket View page

document.addEventListener('DOMContentLoaded', async () => {
  // Get ticket id from query string
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get('id');
  if (!idParam) return;

  const ticketId = Number(idParam);
  if (Number.isNaN(ticketId)) return;

  function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US").format(date);
  }

  const element = id => document.getElementById(id);

  // Elements for main ticket info
  const viewId = element('view-id');
  const viewTitle = element('view-title');
  const viewType = element('view-type');
  const viewOwner = element('view-owner');
  const viewAssignee = element('view-assignee');
  const viewCreated = element('view-created');
  const viewStatus = element('view-status');
  const viewPriority = element('view-priority');
  const viewDescription = element('view-description');

  const deleteBtn = element('delete-ticket');
  const editBtn = element('edit-ticket');

  const commentsContainer = element('comments-container');
  const commentForm = element('comment-form');
  const commentText = element('comment-text');

  let ticket = null;

  // Load single ticket
  async function loadTicket() {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`);
      if (!res.ok) {
        console.error('Failed to load ticket', res.status, res.statusText);
        return;
      }

      ticket = await res.json();

      if (viewId) viewId.textContent = `#${ticket.id}`;
      if (viewTitle) viewTitle.textContent = ticket.subject || '';
      if (viewType) viewType.textContent = ticket.type || '';
      if (viewOwner) viewOwner.textContent = ticket.owner || '';
      if (viewAssignee) viewAssignee.textContent = ticket.assignee || '';
      if (viewCreated) viewCreated.textContent = formatDate(ticket.createdAt) || '';
      if (viewStatus) viewStatus.textContent = ticket.status || '';
      if (viewPriority) viewPriority.textContent = ticket.priority || '';
      if (viewDescription) viewDescription.textContent = ticket.description || '';

    } catch (err) {
      console.error('Error loading ticket:', err);
    }
  }

  // Load comments for this ticket
  async function loadComments() {
    if (!commentsContainer) return;

    commentsContainer.innerHTML = '';

    try {
      const res = await fetch(`/api/tickets/${ticketId}/comments`);
      if (!res.ok) {
        console.error('Failed to load comments', res.status, res.statusText);
        return;
      }

      const comments = await res.json();

      comments.forEach(comment => {
        const div = document.createElement('div');
        div.classList.add('d-flex', 'align-items-start', 'mb-3');

        div.innerHTML = `
          <div>
            <h6 class="mb-1">
              ${comment.author || 'Unknown'}
              <small class="text-muted">• ${formatDate(comment.date) || ''}</small>
            </h6>
            <p class="mb-2">${comment.text || ''}</p>
          </div>
        `;

        commentsContainer.appendChild(div);
      });
    } catch (err) {
      console.error('Error loading comments:', err);
    }
  }

  await loadTicket();
  await loadComments();

  // Delete ticket
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async () => {
      const confirmDelete = confirm('Are you sure you want to delete this ticket?');
      if (!confirmDelete) return;

      try {
        const res = await fetch(`/api/tickets/${ticketId}`, {
          method: 'DELETE'
        });

        if (!res.ok) {
          console.error('Failed to delete ticket', res.status, res.statusText);
          alert('There was a problem deleting this ticket.');
          return;
        }

        window.location.href = '../index.html';
      } catch (err) {
        console.error('Error deleting ticket:', err);
        alert('There was an error connecting to the server.');
      }
    });
  }

  // Edit ticket
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      window.location.href = `ticket-edit.html?id=${ticketId}`;
    });
  }

  // Add a comment
  if (commentForm && commentText) {
    commentForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const text = commentText.value.trim();
      if (!text) return;

      const newComment = {
        author: 'John Doe', // later you can make this dynamic
        text
      };

      try {
        const res = await fetch(`/api/tickets/${ticketId}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newComment)
        });

        if (!res.ok) {
          console.error('Failed to save comment', res.status, res.statusText);
          alert('There was a problem saving your comment.');
          return;
        }

        commentText.value = '';
        await loadComments();
      } catch (err) {
        console.error('Error saving comment:', err);
        alert('There was an error connecting to the server.');
      }
    });
  }
});