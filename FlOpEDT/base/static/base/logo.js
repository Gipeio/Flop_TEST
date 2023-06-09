// This file is part of the FlOpEDT/FlOpScheduler project.
// Copyright (c) 2017
// Authors: Iulian Ober, Paul Renaud-Goud, Pablo Seban, et al.
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
// Affero General Public License for more details.
// 
// You should have received a copy of the GNU Affero General Public
// License along with this program. If not, see
// <http://www.gnu.org/licenses/>.
// 
// You can be released from the requirements of the license by purchasing
// a commercial license. Buying such a license is mandatory as soon as
// you develop activities involving the FlOpEDT/FlOpScheduler software
// without disclosing the source code of your own applications.








/*
     +----------------------------------------------------+
     |			^				  |
     |			| 50                              |
     |			v				  |
     |       +---------------+  +---------------+	  |
     |       |---------------|  |---------------|	  |
     |       |---------------|  |---------------|	  |
     |       |_______________|  |_______________|	  |
     | 							  |
     |<----->+---------------+  +---------------+	  |
     |  50   |---------------|  |---------------|	  |
     |       |---------------|  |---------------|	  |
     |       |_______________|  |_______________|	  |
     | 							  |
     |       +---------------+  +---------------+	  |
     |       |---------------|  |---------------|	  |
     |       |---------------|  |---------------|	  |
     |       |_______________|  |_______________|	  |
     | 							  |
     |                       1050                         |
     |<-------------------------------------------------->|
     +----------------------------------------------------+       
*/

var logo = {
  scale: .12,
  init:{
    dim: 1000,
    margin: 50},
  get_current_dim: function () {
    return this.scale * this.init.dim ;},
  get_current_margin: function () {
    return this.scale * this.init.margin ;},
  par:{
    short_h: {
      id: 'csh',
      hid: '#csh',
      subid: 'shorth',
      subhid: '#shorth'
    },
    long_h: {
      id: 'clh',
      hid: '#clh',
      subid: 'longh',
      subhid: '#longh'
    }
  }
};



var headlines = [
    gettext("Schedule manager <span id=\"flopGreen\">fl</span>exible and <span id=\"flopGreen\">op</span>enSource"),
    gettext("\"Who want to manage schedules this year?\" ...  ... <span id=\"flopGreen\">flop</span>!"),
    gettext("And your schedules will <span id=\"flopRedDel\">flop</span> be a hit!"),
    gettext("Even your logo will be on time..."),
    gettext("Everybody do the <span id=\"flopGreen\">flop</span>!"),
    gettext("You got to make the schedules? Don't flip out: <span id=\"flopGreen\">flop</span> it!"),
    gettext("To flop or not to flop, that is the question (for your schedules)"),
    gettext("flop!Scheduler != flop "),
    gettext("Just <span id=\"flopGreen\">flop</span> it."),
    gettext("Schedule... khhh... I am your flop!"),
    gettext("What else?")
];


init_logo();


function init_logo() {
  fetch_logo();
  init_par_logo();
  init_date();
  resize_logo();
  add_headline();
}


// fetch the logo and include it as svg
function fetch_logo() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url_logo, false);
  xhr.overrideMimeType("image/svg+xml");
  xhr.send("");
  var lolo = document.getElementById("live-logo");
  lolo.appendChild(xhr.responseXML.documentElement);
}


// initialize the long and short hands of the logo
function init_date() {
  var d = new Date();
  var hm = {};
  hm.short_h = 360*(d.getHours() % 12 + d.getMinutes()/60)/12;
  hm.long_h = 360*(d.getMinutes()+d.getSeconds()/60)/60;
  Object.keys(logo.par).forEach(function(h) {
    logo.par[h].rotation[0] += hm[h] ;
  });
  remove_anim_logo() ;
  add_anim_logo() ;
}


function remove_anim_logo() {
  Object.keys(logo.par).forEach(function (h) {
    logo.par[h].anim = $(logo.par[h].hid + ' animateTransform').detach();
  });
}

function add_anim_logo() {
  Object.keys(logo.par).forEach(function (h) {
    var end_rot = logo.par[h].rotation.slice() ;
    end_rot[0] += 360 ;

    logo.par[h].anim.appendTo(logo.par[h].hid);

    $(logo.par[h].hid + ' animateTransform')
      .attr('from', logo.par[h].rotation.join(" "))
      .attr('to', end_rot.join(" "));

    // time is passing even if the animateTransform is out
    document.querySelectorAll('animateTransform').forEach(element => {
      element.beginElement();
    });
    
  });
}

      
function update_rotate_logo() {
  Object.keys(logo.par).forEach(function (h) {
    d3.select(logo.par[h].hid)
      .attr('transform', 'rotate(' + logo.par[h].rotation.join(' ' ) + ')');
  });
}



function resize_logo() {
  logo.svg = d3
    .select("#live-logo")
    .select("svg");
  
  logo.svg
    .select("#dims")
    .attr("transform", "scale(" + logo.scale + ")");
  
  logo.svg
    .attr("width", logo.get_current_dim() + logo.get_current_margin())
    .attr("height", logo.get_current_dim() + logo.get_current_margin());
}

function add_headline() {
  var draw = Math.floor(Math.random() * headlines.length);
  document.getElementById("head_logo").innerHTML = headlines[draw];
}


function init_par_logo () {
  Object.keys(logo.par).forEach( function(hand) {
    var anim_trans = d3.select(logo.par[hand].hid + " animateTransform") ;
    logo.par[hand].from_init = anim_trans.attr("from_init")
      .split(" ")
      .map(function(c){ return +c ; });
    logo.par[hand].rotation = logo.par[hand].from_init.slice() ;
    logo.par[hand].dur = anim_trans.attr("dur") ;
    logo.par[hand].repeatCount = anim_trans.attr("repeatCount") ;
  });
}


// drag long hand
function logo_transform() {

  // compute new angle for the long hand
  
  var center = {x:logo.par.long_h.rotation[1], y:logo.par.long_h.rotation[2]} ;
  var mouse = {x: d3.event.x, y: d3.event.y} ;
  var dx = center.x - mouse.x ;
  var dy = center.y - mouse.y ;

  var angle = -180*Math.atan2(dx, dy)/Math.PI;

  var new_rot = (logo.par.long_h.from_init[0] + angle + 360) % 360 ;

  angle = (new_rot - logo.par.long_h.rotation[0] + 360) % 360 ;

  logo.par.long_h.rotation[0] = new_rot ;
  
  if (angle >= 180) {
    angle -= 360 ;
  }

  angle /= 12 ;
  
  logo.par.short_h.rotation[0] = (logo.par.short_h.rotation[0] + angle + 360) % 360 ;

  update_rotate_logo(false);
}

// disable animation
function drag_hand_start() {
  Object.keys(logo.par).forEach( function(h) {
    // get current rotation
    // firefox does not update 'transform' attribute
    logo.par[h].rotation[0] = document
      .getElementById('logo_svg')
      .querySelector(logo.par[h].hid)
      .transform
      .animVal[0]
      .angle ;
  });
  remove_anim_logo() ;
  update_rotate_logo() ;      
}



// re-enable animation and check final hour
function drag_hand_end() {

  var accuracy = 10 ;
  var diff = ((logo.par.long_h.rotation[0] - logo.par.long_h.from_init[0] + 360) % 360) ;
  if (diff > 180) {
    diff -= 360 ;
  }

  if (Math.abs(diff) < accuracy
      && Math.abs((logo.par.short_h.rotation[0] - logo.par.short_h.from_init[0] + 360)%360  - 10*360/12) < 360/24) {
    add_anim_logo();
    d3.select("html")
      .append("form")
      .attr("style", "display: none")
      .attr("action", url_game)
      .attr("method", "POST")
      .attr("id", "game_form");
    $("#game_form").submit();
  } else {
    add_anim_logo();
  }

}

// enable drag on the long hand
var logo_listener = d3.drag()
  .on('start', drag_hand_start)
  .on('drag', logo_transform)
  .on('end', drag_hand_end);

d3.select("#clh").call(logo_listener);

