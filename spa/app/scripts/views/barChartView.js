/*global spa, Backbone, JST*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'd3'

], function ($, _, Backbone, JST, d3) {
    'use strict';

    var BarChartView = Backbone.View.extend({

        // template: JST['app/scripts/templates/about.hbs'],
        template: 'scripts/templates/about.html',
        el: '#chartData',

        // tagName: 'div',

        // id: '',

        // className: '',

        events: {},

        initialize: function () {
            // this.listenTo(this.model, 'change', this.render);
            // console.log('initialize');
            //this.render();
            
            var dataJson = this.getData();
            
            this.renderBarGraph(dataJson);
            
        },

        renderBarGraph: function (data) {

            var margin = {top: 20, right: 20, bottom: 30, left: 40};
            var width = $(this.el).width() - margin.left - margin.right;
            // var height = $(this.el).height() - margin.top - margin.bottom;
            //width = 960 - margin.left - margin.right,
            var height = 400 - margin.top - margin.bottom;

            var x0 = d3.scale.ordinal()
                .rangeRoundBands([0, width], 0.1);

            var x1 = d3.scale.ordinal();

            var y = d3.scale.linear()
                .range([height, 0]);

            var color = d3.scale.ordinal()
                .range(['rgb(64, 140, 244)', 'rgb(60, 196, 213)', 'rgb(255, 184, 0)', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

            var xAxis = d3.svg.axis()
                .scale(x0)
                .orient('bottom');

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient('left')
                .tickFormat(d3.format('.2s'));

            var svg = d3.select(this.el).append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

//    d3.csv('/scripts/data.csv', function(error, data) {
//            var data = dataJson;
            var ageNames = d3.keys(data[0]).filter(function (key) { return (key !== 'Date' && key !== 'sysDate'); });

            data.forEach(function (d) {
                d.ages = ageNames.map(function (name) { return {name: name, value: +d[name]}; });
            });

            x0.domain(data.map(function (d) { return d.Date; }));
            x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
            // y.domain([0, d3.max(data, function (d) { return d3.max(d.ages, function (d) { return d.value; }); })]);
            y.domain([0, 5]);

            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis);

            svg.append('g')
                .attr('class', 'y axis')
                .call(yAxis)
                .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', 6)
                .attr('dy', '.71em')
                .style('text-anchor', 'end')
                .text('Rating');

            var Date = svg.selectAll('.date')
                .data(data)
                .enter().append('g')
                .attr('class', 'g')
                .attr('transform', function (d) { return 'translate(' + x0(d.Date) + ',0)'; })
                .on('click', function (d) { 
                    console.log(d.sysDate);
                });
                

            Date.selectAll('rect')
                .data(function (d) { return d.ages; })
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('width', x1.rangeBand())
                .attr('x', function (d) { return x1(d.name); })
                .attr('y', function (d) { return y(d.value); })
                .attr('height', function (d) { return height - y(d.value); })
                .style('fill', function (d) { return color(d.name); });

            var legend = svg.selectAll('.legend')
                .data(ageNames.slice().reverse())
                .enter().append('g')
                .attr('class', 'legend')
                .attr('transform', function (d, i) { return 'translate(0,' + i * 20 + ')'; });

            legend.append('rect')
                .attr('x', width - 18)
                .attr('width', 18)
                .attr('height', 18)
                .style('fill', color);

            legend.append('text')
                .attr('x', width - 24)
                .attr('y', 9)
                .attr('dy', '.35em')
                .style('text-anchor', 'end')
                .text(function (d) { return d; });
        },

        getData: function () {
            var data = [
                {
                    'Date': 'Dec 1',
                    'Powder': '2.5',
                    'Snow Quality': '3',
                    'Bluebird': '1.5',
                    'sysDate': '2014-12-01'
                },
                {
                    'Date': 'Dec 2',
                    'Powder': '2.5',
                    'Snow Quality': '3',
                    'Bluebird': '1.5',
                    'sysDate': '2014-12-02'
                },
                {
                    'Date': 'Dec 3',
                    'Powder': '2.5',
                    'Snow Quality': '3',
                    'Bluebird': '1.5',
                    'sysDate': '2014-12-03'
                },
                {
                    'Date': 'Dec 4',
                    'Powder': '2.5',
                    'Snow Quality': '3',
                    'Bluebird': '1.5',
                    'sysDate': '2014-12-04'
                },
                {
                    'Date': 'Dec 5',
                    'Powder': '2.5',
                    'Snow Quality': '3',
                    'Bluebird': '1.5',
                    'sysDate': '2014-12-05'
                },
                {
                    'Date': 'Dec 6',
                    'Powder': '2.5',
                    'Snow Quality': '3',
                    'Bluebird': '1.5',
                    'sysDate': '2014-12-06'
                }
            ];
            return data;
        }

    });
    return BarChartView;

});
