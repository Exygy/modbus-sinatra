$(function() {

  // override standard form submit to submit via AJAX 
  $('#modbus-form').on('submit', function(e) {
    e.preventDefault();

    // could add some extra JS validation here -- for now we just rely on HTML5 "input required" form validation

    // show ajax loader
    $('#submit-btn').append('<img class="ajax-loader" src="/img/ajax-loader.gif" />');
    // hide alert
    $('#result .alert').hide(); 

    // post the form data 
    $.post($(this).attr('action'), $(this).serialize(), 
      function(result) {
        $('.ajax-loader').remove();
        // check for errors
        if (result.errors) {
          // display errors (which come from Exception thrown on server)
          $('#result .alert').fadeIn('fast').addClass('alert-error');
          $('#result .text').html('<strong>Error:</strong><br/>'+result.errors);
          $('#result .results').html('');
        } else {
          // SUCCESS!
          // display computed value
          $('#result .alert').fadeIn('fast').removeClass('alert-error');
          $('#result .text').html('<strong>Connected!</strong>');
          var $ul;
          if ($('#result .results ul').length) {
            $ul = $('#result .results ul');
          } else {
            $ul = $('<ul></ul>');
            $('#result .results').append($ul);
          }
          $ul.append('<li><em>'+result.gmt+':</em> '+result.computed+'</li>');

        }
        $('#dialog').modal({keyboard: true});
        $('#dialog').modal('show');
      }
    );

  });

  $('#result .close').on('click', function(e) {
    e.preventDefault();
    $('#result .alert').hide();
  });
});
