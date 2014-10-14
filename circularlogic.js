
var diameter = Math.min(Math.max(document.documentElement.clientWidth, window.innerWidth || 0), Math.max(document.documentElement.clientHeight, window.innerHeight || 0));


var color = d3.scale.linear()
    .domain([-1, 5])
    .range(["hsl(0%,0%,90%)", "hsl(0%,0%,30%)"])
    .interpolate(d3.interpolateHcl);

var pack = d3.layout.pack()
    .padding(2)
    .size([diameter, diameter])
    .value(function(d) { return d.size; })

var svg = d3.select("body").append("svg")
    .attr("width",Math.max(document.documentElement.clientWidth, window.innerWidth || 0))
    .attr("height", diameter)
  .append("g")
    .attr("transform", "translate(" + Math.max(document.documentElement.clientWidth, window.innerWidth || 0) / 2 + "," + diameter / 2 + ")");

d3.json("datasized.json", function(error, root) {
  if (error) return console.error(error);

  var focus = root,
      nodes = pack.nodes(root),
      view;

  var circle = svg.selectAll("circle")
      .data(nodes)
    .enter().append("circle")
      .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
      .style("fill", function(d) { return d.children ? color(d.depth) : null; })
      .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

  var text = svg.selectAll("text")
      .data(nodes)
    .enter().append("text")
      .attr("class", "label")
      .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
      .style("display", function(d) { return d.parent === root ? null : "none"; })
      .text(function(d) { return d.name; });

  var node = svg.selectAll("circle,text");

  d3.select("body")
      .style("background", color(-1))
      .on("click", function() { zoom(root); });

  zoomTo([root.x, root.y, root.r * 2]);

  function zoom(d) {
    var focus0 = focus; focus = d;

    var transition = d3.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function(d) {
          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return function(t) { zoomTo(i(t)); };
        });

    transition.selectAll("text")
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
        .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    $("div").hide();
    $("#header").html(d.name);
    if(!d.children) {   
    	  

    $('#article').wikiblurb(
		{
			wikiURL: "http://en.wikipedia.org/",
			apiPath: 'w',
			section: 0,
			page: d.name,
			removeLinks: false,
			type: 'all',
			customSelector: ''
		});
	setTimeout(function(){$("div").show()}, 750);
  }
  }

  function zoomTo(v) {
    var k = diameter / v[2]; view = v;
    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    circle.attr("r", function(d) { return d.r * k; });
  }
});

d3.select(self.frameElement).style("height", diameter + "px");
$(document).ready(function()
{
	$('#article').wikiblurb(
	{
		wikiURL: "http://en.wikipedia.org/",
		apiPath: 'w',
		section: 0,
		page: 'Free software',
		removeLinks: false,
		type: 'all',
		customSelector: ''
	});
});
$(document).ready(function(){
                $('#article').tinyscrollbar();
            });
