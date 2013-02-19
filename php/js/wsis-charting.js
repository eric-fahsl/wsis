function loadChart(url) {

	var plot1 = $.jqplot('ratingsChart', url, { 
	        //title: 'Ratings for <?= $resortName ?>', 
	        dataRenderer: ajaxDataRenderer,
		    series: [		        		        
		        {
		        	yaxis: 'y2axis',
		        	color: '#a9a9a9',
		        	shadow: false,
		        	label: 'Top Elevation',
		        	showMarker: false
		        },
		        {
		        	yaxis: 'y2axis',
		        	color: '#a9a9a9',
		        	shadow: false,
		        	label: 'Bottom Elevation',
		        	showMarker: false
		        },
		        {
		        	label: 'Freezing Level',
		        	color: '#d092db',
		        	yaxis: 'y2axis',		        	
		        	markerOptions: { style: 'x'}
		        },
		        {
		            label: 'Bluebird',
		            color: '#dbb346',
		            lineWidth: 4,
		            markerOptions: { size: 12 }
		        },
		        { 
		            label: 'Powder',
		            markerOptions:{ size: 12, style:'diamond'},
		            lineWidth: 4,
		            color: '#18c2e1'
		            
		        },	      
		        
	        ], 
	        axes: { 
	            xaxis: { 
	                renderer:$.jqplot.DateAxisRenderer,
	                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
	                tickOptions: {
	                  angle: -40,
	                  formatString:'%a, %b %#d'

	                }
	            },
	            yaxis: {
	            	min: 0, max: 5,
	            	pad: 1.05,
	            	label: 'Rating',
	            	labelRenderer: $.jqplot.CanvasAxisLabelRenderer

	           	},
	           	y2axis: {
	           		label: 'Freezing Level',
	           		labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
	           		labelOptions: { angle: 90 }
	           	}
	        }, 
	        highlighter: {
		        show: true,
		        sizeAdjust: 7.5
		    },
	        legend: { show: true } 
	    });

	    
	    $('#ratingsChart').bind('jqplotDataClick', 
            function (ev, seriesIndex, pointIndex, data) {
                //$('#info1').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);
                var d = new Date(data[0]);
                var month = d.getMonth() + 1;
                if (month < 10) month = "0" + month;
                var day = d.getDate();
                if (day < 10) day = "0" + day;
                var ratingDate = d.getFullYear() + "-" + month + "-" + day;
                var url = "resorts?resort=<?= $resort ?>&date=" + ratingDate;
                window.location.href = url;
            }
        );

  }