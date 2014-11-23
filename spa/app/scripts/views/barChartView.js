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
                .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

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
            var ageNames = d3.keys(data[0]).filter(function (key) { return key !== 'Date'; });

            data.forEach(function (d) {
                d.ages = ageNames.map(function (name) { return {name: name, value: +d[name]}; });
            });

            x0.domain(data.map(function (d) { return d.Date; }));
            x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
            y.domain([0, d3.max(data, function (d) { return d3.max(d.ages, function (d) { return d.value; }); })]);

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
                .text('Population');

            var Date = svg.selectAll('.date')
                .data(data)
                .enter().append('g')
                .attr('class', 'g')
                .attr('transform', function (d) { return 'translate(' + x0(d.Date) + ',0)'; });

            Date.selectAll('rect')
                .data(function (d) { return d.ages; })
                .enter().append('rect')
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
                    'Date': 'CA',
                    'Under5Years': '2704659',
                    '5to13Years': '4499890',
                    '14to17Years': '2159981'
                },
                {
                    'Date': 'TX',
                    'Under5Years': '2027307',
                    '5to13Years': '3277946',
                    '14to17Years': '1420518',
                    '18to24Years': '2454721'
                },
                {
                    'Date': 'NY',
                    'Under5Years': '1208495',
                    '5to13Years': '2141490',
                    '14to17Years': '1058031'
                },
                {
                    'Date': 'FL',
                    'Under5Years': '1140516',
                    '5to13Years': '1938695',
                    '14to17Years': '925060'
                },
                {
                    'Date': 'IL',
                    'Under5Years': '894368',
                    '5to13Years': '1558919',
                    '14to17Years': '725973'
                },
                {
                    'Date': 'PA',
                    'Under5Years': '737462',
                    '5to13Years': '1345341',
                    '14to17Years': '679201'
                }
            ];
            return data;
        }

    });
    return BarChartView;

});
