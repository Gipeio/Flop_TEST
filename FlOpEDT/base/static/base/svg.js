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


// "svg" will be the name of the svg container
function Svg(light) {
  this.layout = {};
  this.layout["svg"] = null;
  this.light = light;
}

// add a layout named child_name as a child of parent_name layout
Svg.prototype.add_child = function (parent_name, child_name) {
  if (Object.keys(this.layout).includes(child_name)) {
    console.log("Name " + child_name + " already in use");
    return null;
  }
  if (!Object.keys(this.layout).includes(parent_name)) {
    console.log("Parent " + parent_name + " unknown");
    return null;
  }
  this.layout[child_name] = this.layout[parent_name]
    .append("g").attr("id", "layout-" + child_name);
  return this.layout[child_name];
};

// get the dom element corresponding to a layout name
Svg.prototype.get_dom = function (name) {
  return this.layout[name];
};

// create the svg element in the page
Svg.prototype.create_container = function () {
  var tot;

  if (this.light) {
    tot = d3.select("body");
  } else {
    tot = d3.select("body").append("div");
  }

  // for stype
  if (!d3.select("#svg").empty()) {
    tot = d3.select("#svg");
  }

  // useful?
  //.attr("text-anchor","middle")


  this.layout["svg"] = tot
    .append("svg")
    .attr("width", dsp_svg.w)
    .attr("height", dsp_svg.h)
    .attr("id", "edt-main")
    .append("g")
    .attr("transform", dsp_svg.trans());

};

// create layouts according to the plan
Svg.prototype.create_layouts = function (build_plan_grounds) {
  build_plan_grounds.forEach(function (parent_child) {
    this.add_child(parent_child[0], parent_child[1]);
  }, this);
};
