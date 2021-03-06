function generate_chart() {
    var chart = d3.select('.compliant');
    var width = chart.attr("data-width");
    if (width == null)
        width = calculate_width();
    width = parseInt(width);
    var height = width * 1.2;
    var radius = Math.min(width, height) / 2;
    var color = d3.scale.ordinal()
        .range(["#0071e1", "#888888"]);
    var arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(radius - 40);
    var pie = d3.layout.pie()
        .value(function (d) {
        return d.value;
    })
        .sort(null);
    chart = chart
        .append('svg')
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");
    d3.json("/data/reports/https.json", function (error, data) {
        // calculate % client-side
        var compliant = Math.round((data.enforces / data.eligible) * 100);
        // just abort and leave it blank if something's wrong
        // (instead of showing "NaN%" visually)
        if (isNaN(compliant))
            return;
        var pie_data = [
            {status: 'active', value: compliant},
            {status: 'inactive', value: (100-compliant)},
        ]
        var g = chart.selectAll(".arc")
            .data(pie(pie_data))
            .enter().append("g")
            .attr("class", "arc");
        g.append("path")
            .style("fill", function(d) {
            return color(d.data.status);
        })
            .transition().delay(function(d, i) {
            return i *400;
        }).duration(400)
            .attrTween('d', function(d) {
            var i = d3.interpolate(d.startAngle+ 0.1, d.endAngle);
            return function(t) {
                d.endAngle = i(t);
                return arc(d);
            }
        });
        g.append("text")
            .attr("text-anchor", "middle")
            .attr("class", "text-5xl font-bold")
            .attr("dy", "0.4em")
            .attr("fill", "black")
            .text(function(d){
                return "" + pie_data[0].value + "%";
        });
    });
};

function calculate_width() {
    var window_width = $(window).width();

    if(window_width < 769)
        return 250;
    else
        return 287;
}

generate_chart();

