/* jshint esversion: 6 */

function message_reset_display() {
    const message_div = $("#form-message-profil");
    message_div.removeClass(function (index, className) {
        return (className.match(/(^|\s)alert-\S+/g) || []).join(' ');
    });
    message_div.text("");
}



function message_ondisplay(msg_type, content) {
    message_reset_display();
    const message_div = $("#form-message-profil");
    message_div.addClass("alert-" + msg_type);
    message_div.text(content);
    message_div.show();
}


$('#modal-profil-edit').on('show.bs.modal', function(e){
  checkVacataireOrFullStaff();
});

function checkVacataireOrFullStaff() {
  var statusSelect = document.getElementById('newInputStatus');
  var strUser = statusSelect.options[statusSelect.selectedIndex].text;
  var idStatusVacataire = document.getElementById('statusVacataire');
  var idEmployer = document.getElementById('employer');
  var idIsIut = document.getElementById('is_iut_checkbox');
  if(strUser=='Vacataire') {
      idStatusVacataire.style.display = "block";
      idEmployer.style.display = "block";
      idIsIut.style.display = "none";
  } else if(strUser=='Permanent'){
      idStatusVacataire.style.display = "none";
      idEmployer.style.display = "none";
      idIsIut.style.display = "block";
  } else {
    idStatusVacataire.style.display = "none";
    idEmployer.style.display = "none";
    idIsIut.style.display = "none";
  }

}



$('#form-profil').submit(function(event) {

  event.preventDefault();
  var form = $(this);
  var url = form.attr('action');
  $("#validerProfil").addClass('disabled');
  $("#cancel-profil").addClass('disabled');
  const button_html = $("#validerProfil").html();
  $("#validerProfil").html("<i class=\"fas fa-spinner fa-pulse\"></i>");
  $.ajax({
      type: "POST",
      url: url,
      data: form.serialize(),
      success: function(response) {
          $("#validerProfil").html(button_html);
          $("#validerProfil").removeClass('disabled');
          $("#cancel-profil").removeClass('disabled');
          switch(response.status) {
            case 'OK':
              window.location.href = "";
              break;
            case 'ERROR':
              message_ondisplay("warning", response.message);
              break;
            case 'UNKNOWN':
              message_ondisplay("warning", response.message);
              break;
          }

      },
      error: function(error) {
          $("#validerProfil").html(button_html);
          message_ondisplay(form, "warning", "Une erreur est survenue. Veuillez réessayer.");
      },
  });
});
