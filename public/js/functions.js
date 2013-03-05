$(function() {
  $('#modbus-form').on('submit', function(e) {
    e.preventDefault();

    $.post($(this).attr('action'), $(this).serialize(), 
      function(d) {
        if (d.errors) {
          $('#dialog .modal-body').html('<div class="alert alert-error">'+d.errors+'</div>');
        } else if (d.success) {
          $('#dialog .modal-body').html('<div class="alert alert-success">Connected!</div>');          
        }
        $('#dialog').modal('show');
      }
    );

  });
});