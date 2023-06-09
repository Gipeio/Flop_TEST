/* jshint esversion: 6 */

function is_slug(string) {
    return /^[a-zA-Z]\w{0,6}$/.test(string);
}

function message_reset(element) {
  const message_div = element.find(".form-message");
  message_div.removeClass(function(index, className) {
    return (className.match(/(^|\s)alert-\S+/g) || []).join(' ');
  });
  message_div.text("");
}

function message_hide(element) {
  const message_div = element.find(".form-message");
  message_div.hide();
  message_reset(element);
}

function message_display(element, msg_type, content) {
  message_reset(element);
  const message_div = element.find(".form-message");
  message_div.addClass("alert-"+msg_type);
  message_div.text(content);
  message_div.show();
}

$(".modal-form").submit(function(event) {
    event.preventDefault();

    var form = $(this);
    var url = form.attr('action');
    const button = form.find(".button-submit");
    const button_html = button.html();
    button.html("<i class=\"fas fa-spinner fa-pulse\"></i>");
    $.ajax({
        type: "POST",
        url: url,
        data: form.serialize(),
        success: function(response) {
            button.html(button_html);
            switch(response.status) {
              case 'OK':
                window.location.href = "";
                break;
              case 'ERROR':
                message_display(form, "warning", response.message);
                break;
              case 'UNKNOWN':
                message_display(form, "warning", response.message);
            }

        },
        error: function(error) {
            button.html(button_html);
            message_display(form, "warning", "Une erreur est survenue. Veuillez réessayer.");
        },
    });
});

$(".button-submit").click(function(){
    var form = $(this).closest(".modal-content").find("form");
    const inputNomDep = form.find(".new_dept_name");
    const inputAbbrev = form.find(".new_dept_abbrev");
    const inputResp = form.find(".resps");
    if(inputNomDep.val().length > 0 && inputNomDep.val().length <= 50) {
        if(is_slug(inputAbbrev.val()) && inputAbbrev.val().length <= 7) {
            if(inputResp[0].selectedIndex !== 0) {
                message_hide(form);
                form.submit();
            } else {
                message_display(form, "warning", "Vous devez sélectionner un responsable.");
            }
        } else {
            message_display(form, "warning", "L'abréviation du département est invalide. Elle doit être entre 1 et 7 caractères. Elle peut comporter des lettres et des chiffres et doit commencer par une lettre. Elle ne doit pas comporter d'espace, utilisez des '_' pour les séparations.");
        }
    } else {
        message_display(form, "warning", "Le nom du département est invalide. Il doit comporter entre 1 et 50 caractères.");
    }
});
