$(function() {

  // override standard form submit to submit via AJAX 
  $('#modbus-form').on('submit', function(e) {
    e.preventDefault();

    // could add some extra JS validation here -- for now we just rely on HTML5 "input required" form validation

    // show ajax loader
    $('#submit-btn').append('<img class="ajax-loader" src="/img/ajax-loader.gif" />');
    // hide alert (if no results)
    if (!$('ul#results li').length) $('#result .alert').hide(); 

    // post the form data 
    $.post($(this).attr('action'), $(this).serialize(), 
      function(result) {
        $('.ajax-loader').remove();
        // check for errors
        if (result.errors) {
          // display errors (which come from Exception thrown on server)
          $('#result .alert').fadeIn('fast').addClass('alert-error');
          $('#result .text').html('<strong>Error:</strong><br/>'+result.errors);
          $('ul#results li').remove();
        } else {
          // SUCCESS!
          // display computed value
          $('#result .alert').fadeIn('fast').removeClass('alert-error');
          $('#result .text').html('<strong>Connected!</strong>');

          // find <ul> element 
          var $ul = $('ul#results');

          // add result to the list 
          $li = $('<li><em style="font-size:12px; color:#999;">'+result.gmt+':</em>&nbsp; '+result.computed+'</li>');
          $ul.append($li);
          $li.hide().slideDown();

        }
      }
    );

  });

  $('#result .close').on('click', function(e) {
    e.preventDefault();
    $('ul#results li').remove();
    $('#result .alert').hide();
  });
});
