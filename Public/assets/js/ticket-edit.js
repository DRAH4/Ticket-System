/**
 * Edit Ticket Script
 */

'use strict';

// Javascript to handle the Edit Ticket page

document.addEventListener('DOMContentLoaded', () => {

  // Comment editor

  const commentEditor = document.querySelector('.comment-editor');
  let quill;

  if (commentEditor) {
    quill = new Quill(commentEditor, {
      modules: {
        toolbar: '.comment-toolbar'
      },
      placeholder: 'Ticket Description',
      theme: 'snow'
    });
  }

  // previewTemplate: Updated Dropzone default previewTemplate

  const previewTemplate = `<div class="dz-preview dz-file-preview">
<div class="dz-details">
  <div class="dz-thumbnail">
    <img data-dz-thumbnail>
    <span class="dz-nopreview">No preview</span>
    <div class="dz-success-mark"></div>
    <div class="dz-error-mark"></div>
    <div class="dz-error-message"><span data-dz-errormessage></span></div>
    <div class="progress">
      <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuemin="0" aria-valuemax="100" data-dz-uploadprogress></div>
    </div>
  </div>
  <div class="dz-filename" data-dz-name></div>
  <div class="dz-size" data-dz-size></div>
</div>
</div>`;

  // Basic Dropzone

  const dropzoneBasic = document.querySelector('#dropzone-basic');
  if (dropzoneBasic) {
    const myDropzone = new Dropzone(dropzoneBasic, {
      previewTemplate: previewTemplate,
      parallelUploads: 1,
      maxFilesize: 5,
      acceptedFiles: '.jpg,.jpeg,.png,.gif',
      addRemoveLinks: true,
      maxFiles: 1
    });
  }


  // Get IDs for ticket information
  const ticketNumber = document.getElementById('ticketNumber');
  const ticketSubject = document.getElementById('ticket-subject');
  //const ticketImage = document.getElementById('dropzone-basic');
  const ticketPriority = document.getElementById('ticket-priority');
  const ticketAssignee = document.getElementById('ticket-assignee');
  const ticketType = document.getElementById('ticket-type');
  const ticketStatus = document.getElementById('ticket-status');
  const ticketOwner = document.getElementById('ticket-owner');
  const saveButton = document.getElementById('save-ticket');
  const cancelBtn = document.getElementById('cancel-ticket');

  if (!saveButton) return;

  // Get ticket id from query string
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get('id');
  if (!idParam) return;
  const ticketId = Number(idParam);

  let currentTicket = null;

  // Load ticket from backend and prefill the form
  async function loadTicket() {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`);
      if (!res.ok) {
        console.error('Failed to load ticket', res.status, res.statusText);
        return;
      }

      const ticket = await res.json();
      currentTicket = ticket;
  
      if (ticketNumber) ticketNumber.textContent = `Ticket #${ticket.id}`;
      if (ticketSubject) ticketSubject.value = ticket.subject || '';
      //if (ticketImage) ticketImage.value = ticket.image || '';
      if (ticketPriority) ticketPriority.value = ticket.priority || '';
      if (ticketAssignee) ticketAssignee.value = ticket.assignee || '';
      if (ticketType) ticketType.value = ticket.type || '';
      if (ticketStatus) ticketStatus.value = ticket.status || '';
      if (ticketOwner) ticketOwner.value = ticket.owner || '';

      if (quill) {
        quill.setText(ticket.description || '');
      }
    } catch (err) {
      console.error('Error loading ticket:', err);
    }
  }

  loadTicket();

  // Save button handler
  saveButton.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!currentTicket) return;

  // Defining and cleaning ticket description
  const descriptionText = quill ? quill.getText().trim() : '';

  // Basic validation
  if (
    !ticketSubject.value.trim() ||
    !descriptionText ||
    !ticketPriority.value ||
    !ticketAssignee.value ||
    !ticketType.value ||
    !ticketStatus.value ||
    !ticketOwner.value.trim()
  ) {
    alert('One or more required fields are empty.');
    return;
  }

     // Build updated ticket
    const updatedTicket = {
      subject: ticketSubject.value.trim(),
      description: descriptionText,
      priority: ticketPriority.value,
      assignee: ticketAssignee.value,
      type: ticketType.value,
      status: ticketStatus.value,
      owner: ticketOwner.value.trim()
    };

    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTicket)
      });

      if (!res.ok) {
        console.error('Failed to update ticket', res.status, res.statusText);
        alert('There was a problem updating the ticket.');
        return;
      }

      // Go back to view page
      window.location.href = `ticket-view.html?id=${ticketId}`;
    } catch (err) {
      console.error('Error updating ticket:', err);
      alert('There was an error connecting to the server.');
    }
  });

  // Cancel button just goes back to view
  if (cancelBtn) {
    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = `ticket-view.html?id=${ticketId}`;
    });
  }


});