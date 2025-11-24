/**
 * Create Ticket Script
 */

'use strict';

// Javascript to handle the Create Ticket page

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
  const createTicket = document.getElementById('create-ticket');
  const ticketSubject = document.getElementById('ticket-subject');
  const ticketImage = document.getElementById('dropzone-basic');
  const ticketPriority = document.getElementById('ticket-priority');
  const ticketAssignee = document.getElementById('ticket-assignee');
  const ticketType = document.getElementById('ticket-type');
  const ticketStatus = document.getElementById('ticket-status');
  const ticketOwner = document.getElementById('ticket-owner');


  createTicket.addEventListener('click', () => {

    // Get Description from quill
    let ticketDescription = '';
    if (quill) {
      ticketDescription = quill.getText().trim(); 
    }

    // Check if everything is filled in
    if (
      ticketSubject.value.trim() === '' ||
      ticketDescription.trim() === '' ||
      ticketPriority.value === '' ||
      ticketAssignee.value === '' ||
      ticketType.value === '' ||
      ticketStatus.value === '' ||
      ticketOwner.value === ''
    ) {
      alert('One or more values are empty');
      return;
    }
     
    // Build ticket object
    const newTicket = {
      id: Date.now(),
      subject: ticketSubject.value.trim(),
      description: ticketDescription,
      priority: ticketPriority.value,
      assignee: ticketAssignee.value,
      type: ticketType.value,
      status: ticketStatus.value,
      owner: ticketOwner.value,
      createdAt: new Date().toLocaleDateString('en-US'),
      comments: []
    };

    console.log('New ticket:', newTicket);

    // Save to localStorage to show up on ticket list page

    const stored = localStorage.getItem('tickets');
    const tickets = stored ? JSON.parse(stored) : [];
    tickets.push(newTicket);
    localStorage.setItem('tickets', JSON.stringify(tickets));

    // Go back to ticket list page
    window.location.href = '../index.html';


  });

});

