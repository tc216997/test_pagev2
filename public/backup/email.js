let timeouts = [];
$(document).ready(function(){
  //$('#email-modal').modal('show');
  $('.button-3d').each(function(){
    $(this).unbind().click(function(){
      let val = $(this).val();
      let name = $(this).attr('name');
      changeModalTitle(name);
      $('.dropdown').click(function(){
        $('.payment-options').unbind().click(function(){
          let file = val + '-' + $(this).attr('data-payment');
          showDownloadDiv();
          $('#machine-pdf').attr('href', '/pdf?filename=' +  file)
        });
      });
    });
  });
  $('#finance-modal').on('hidden.bs.modal', function(){
    hideDownloadDiv();
  });
  $('#finance-modal-email').click(function (){
    $('#email-modal').modal('show');
    return false;
  });
  $('#email-modal').on('hidden.bs.modal', function() {
    $('#contact_form').data('bootstrapValidator').resetForm();
  });
});

$(document).ready(function(){
  let checkFunctionExist = setInterval(function() {
    if (typeof emailValidator === 'function') {
      emailValidator();
      clearInterval(checkFunctionExist);
    }
  }, 100);
});

function changeModalTitle(machine) {
  let title = 'Please choose your payment options for '  + machine;
  $('.modal-title').text(title);
}


function showDownloadDiv() {
  $('#download-div').slideDown('slow');
}

function hideDownloadDiv() {
  $('#download-div').hide();
}

function clearTimeouts() {
  timeouts.map(item => {
    clearTimeout(item);
    timeouts.shift();
  });
}

function successEmail() {
  $('#send-email').text('Sent');
  $('#send-email').attr('class', 'btn btn-success btn-lg');
  $('#send-email').append($('<span class="glyphicon glyphicon-ok" id="send-email-span" style="margin-left:5px;"></span>'));
  $('#contact_form')[0].reset();
  $('#success_message').slideDown({ opacity: "show" }, "slow");
  timeouts.push(setTimeout(function() {
    $('#contact_form :input').prop('disabled', false);
    $('#success_message').slideUp({ opacity: "hide" }, "slow");
    $('#success_message').hide();
    $('#send-email').text('Send');
    $('#send-email').attr('class', 'btn btn-default btn-lg');
    $('#send-email').append($('<i class="fa fa-space-shuttle" style="margin-left:5px;"></i>'));
    clearTimeouts();
    }, 4000)
  );
}

function errorEmail() {
  $('#send-email').text('Error');
  $('#send-email').attr('class', 'btn btn-danger btn-lg');
  $('#send-email').append($('<i class="fa fa-exclamation-triangle" style="margin-left:5px;"></i>'));
  $('#error_message').slideDown({opacity:'show'}, 'slow');
  timeouts.push(setTimeout(function() {
    $('#contact_form :input').prop('disabled', false);
    $('#error_message').slideUp({opacity:'hide'}, 'slow');
    $('#send-email').text('Send again');
    $('#send-email').attr('class', 'btn btn-default btn-lg');
    $('#send-email').append($('<i class="fa fa-space-shuttle" style="margin-left:5px"></i>'));
    clearTimeouts()
    }, 4000)
  );
}

function loadingEmail() {
  $('#send-email').text('Sending');
  $('#send-email').append($('<i class="fa fa-space-shuttle faa-passing animated" style="margin-left:5px"></i>'));
  $('#contact_form :input').prop('disabled', true);
}

function emailValidator() {
  $('#contact_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            name: {
                validators: {
                        stringLength: {
                        min: 2,
                    },
                        notEmpty: {
                        message: 'Please enter your name'
                    }
                }
            },
             subject: {
                validators: {
                     stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please enter a subject'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'Please enter your email address'
                    },
                    emailAddress: {
                        message: 'Please enter a valid email address'
                    }
                }
            },
            message: {
                validators: {
                      notEmpty: {
                          message: 'Please enter a message'
                      }
                    }
                }
            }
        })
        .on('success.form.bv', function(e) {
            // Prevent form submission
            e.preventDefault();
            // reset validator checks
            $('#contact_form').data('bootstrapValidator').resetForm();
            // Get the form instance
            let $form = $(e.target);
            let formData = $(e.target).serialize()
            // Get the BootstrapValidator instance
            let bv = $form.data('bootstrapValidator');
            // Use Ajax to submit form data
            $.ajax({
              url: '/send-email',
              type:'POST',
              data: formData,
              dataType:'json',
              beforeSend: function() {
                loadingEmail();
              },
              error: errorEmail(),
              success: successEmail(),
            });
        });
}
