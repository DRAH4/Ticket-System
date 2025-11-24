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

  // ! Don't change it unless you really know what you are doing

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
  const ticketImage = document.getElementById('dropzone-basic');
  const ticketPriority = document.getElementById('ticket-priority');
  const ticketAssignee = document.getElementById('ticket-assignee');
  const ticketType = document.getElementById('ticket-type');
  const ticketStatus = document.getElementById('ticket-status');
  const ticketOwner = document.getElementById('ticket-owner');
  const saveButton = document.getElementById('save-ticket');

  if (!saveButton) return;


  const params = new URLSearchParams(window.location.search);
  const idParam = params.get('id');
  if (!idParam) return;
  const ticketId = Number(idParam);

  const stored = localStorage.getItem('tickets');
  if (!stored) return;

  let tickets = JSON.parse(stored);
  let ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;
  
  if (ticketNumber) ticketNumber.textContent = `Ticket #${ticket.id}`;
  if (ticketSubject) ticketSubject.value = ticket.subject || '';
  if (ticketImage) ticketImage.value = ticket.image || '';
  if (ticketPriority) ticketPriority.value = ticket.priority || '';
  if (ticketAssignee) ticketAssignee.value = ticket.assignee || '';
  if (ticketType) ticketType.value = ticket.type || '';
  if (ticketStatus) ticketStatus.value = ticket.status || '';
  if (ticketOwner) ticketOwner.value = ticket.owner || '';

  if (quill) {
    quill.setText(ticket.description || '');
  }

  saveButton.addEventListener('click', () => {
  // Basic validation
  let descriptionText = quill ? quill.getText().trim() : '';

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

    ticket.subject = ticketSubject.value.trim();
    ticket.priority = ticketPriority.value;
    ticket.assignee = ticketAssignee.value;
    ticket.type = ticketType.value;
    ticket.status = ticketStatus.value;
    ticket.owner = ticketOwner.value.trim();
    ticket.description = descriptionText;

    // put updated ticket back in array
    tickets = tickets.map(t => (t.id === ticketId ? ticket : t));

    // save back to localStorage
    localStorage.setItem('tickets', JSON.stringify(tickets));

    // redirect back to view after saving
    window.location.href = `ticket-view.html?id=${ticketId}`;
  });


  // redirect back to view after canceling
  const cancelBtn = document.getElementById('cancel-ticket');
  if (!cancelBtn) return;

  cancelBtn.addEventListener('click', () => {
    window.location.href = `ticket-view.html?id=${ticketId}`;
  });


});