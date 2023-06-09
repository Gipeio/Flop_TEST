// Text for morning preferences
// Text for preferences concerning day length
// Text for hole preferences, if you want or not between courses
// Text for preferences concerning if you want to eat early or late
function txt_morning_half(val, id) {
  if (id == 'morning') {
    switch (val) {
    case "0":
        return gettext('Start early in order to end up early');
        break;
    case "0.25":
        return gettext('Do not start late, so as not to end up too late');
        break;
    case "0.5":
        return gettext('Indifferent');
        break;
    case "0.75":
        return gettext("Do not start early, even if I don't end up early");
        break;
    case "1":
        return gettext('Start late, even if I end up late');
        break;
    }
  } 
  if (id == 'free_half_day'){
    switch (val) {
    case "0":
        return gettext("Have light days");
        break;
    case "0.25":
        return gettext("Have light days more than free half-days");
        break;
    case "0.5":
        return gettext('Indifferent');
        break;
    case "0.75":
        return gettext("Have free half-days more than light days.");
        break;
    case "1":
        return gettext("Have free half-days.");
        break;
    }
  }
  if (id == 'hole'){
    switch (val) {
    case "0":
        return gettext("Avoid holes between courses");
        break;
    case "0.5":
        return gettext('Indifferent');
        break;
    case "1":
        return gettext("Promote holes between courses");
        break;
    }
  }
  if (id == 'selfeat'){
    switch (val) {
    case "0":
        return gettext("Eat early");
        break;
    case "0.5":
        return gettext('Indifferent');
        break;
    case "1":
        return gettext('Eat late');
        break;
    }
  }
}


// update comments associated with range value
function update_comment(id) {
  return function () {
    var txt = txt_morning_half($('#'+id).val(), id);
        $('#'+id).next().text(txt);
    } ;
}

// main
$(function() {
    var ids = ['morning', 'free_half_day', 'hole', 'selfeat'] ;
    ids.forEach(function(id) {
        $('#'+id).on('input', update_comment(id));
        $(document).ready(update_comment(id));
    });
});

function make_grid(){
    let grille = d3.select("svg#grille");

    //Creation of the little board
    let len_square = 95;
    let id=0;
    let y_start = 5;
    let x_start = 5;

    for (var i = 0; i < 5; i++) {

        grille
        .append("rect")
        .attr("id", id+1)
        .attr("fill", "green" )
        .attr("width", len_square)
        .attr("height", len_square)
        .attr("x", x_start + i*len_square)
        .attr("y", y_start);

         d3.select("svg#grille")
        .append("rect")
        .attr("id", id+2)
        .attr("fill", "green")
        .attr("width", len_square)
        .attr("height", len_square)
        .attr("x", x_start + i*len_square)
        .attr("y", y_start + len_square);
        id += 2;
    }


    for (let i = 0; i < 6; i++) {
        d3.select("svg#grille")
        .append("line")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("x1", x_start + i * len_square)
        .attr("y1", y_start)
        .attr("x2", x_start + i * len_square)
        .attr("y2", y_start + 2 * len_square);
    }


    for (let i = 0; i < 3; i++) {
        d3.select("svg#grille")
        .append("line")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("x1", x_start)
        .attr("y1", y_start + i * len_square)
        .attr("x2", x_start + 5 * len_square)
        .attr("y2", y_start + i * len_square);
    }
}