
function init_dropdown_period(){
    for (p of all_periods){
        console.log(p)
        $('#period').append($('<option>', {
            value: p,
            text: p
        }));
    }
}

function get_period() {
    return $("#period option:selected").val();
}

function download_file_dispo() {
    window.open(window.location.href + 'get_dispo_file/'+get_period()+"/", '_blank');
    return false;
}

// init_dropdown_period()