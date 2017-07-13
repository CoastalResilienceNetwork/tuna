define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask"
],
function ( declare, Query, QueryTask ) {
        "use strict";

        return declare(null, {
			eventListeners: function(t){
				$("#" + t.id + "selectScale").chosen({allow_single_deselect:false, width:"240px"})
					.change(function(c){
						t.obj.selectedScale = c.target.value;
						t.obj.visibleLayers = [ t[t.obj.selectedScale] ];
						if (t.obj.selectedScale == "USLeaseBlock"){
							t.obj.visibleLayers.push(t.USProtractionArea)
						}
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);	
						$("#" + t.id + "click-wrap").slideUp();
						$("#" + t.id + "click-map").html("Click Map for Species Info");
						$("#" + t.id + "symbolizeBy").val("").trigger("chosen:updated")
						$("#" + t.id + "symByWrap").slideDown();
						t.selFtr = -1;
					});
				$("#" + t.id + "symbolizeBy").chosen({allow_single_deselect:false, width:"240px"})
					.change(function(c){
						t.obj.symbolizeBy = c.target.value;
						t.sname = $(c.currentTarget).find(":selected").text()
						t.obj.visibleLayers = [ t.symLayers[t.obj.selectedScale][t.obj.symbolizeBy] ];
						if (t.obj.selectedScale == "USLeaseBlock"){
							t.obj.visibleLayers.push(t.USProtractionArea)
						}
						if (t.selFtr > -1){
							t.obj.visibleLayers.push(t.selFtr)
						}
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
						$("#" + t.id + "species-wrap").slideDown();	
						t.esriapi.rowClicked(t);
					});						
			},
			commaSeparateNumber: function(val){
				while (/(\d+)(\d{3})/.test(val.toString())){
					val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
				}
				return val;
			},
			roundTo: function(n, digits) {
				if (digits === undefined) {
			    	digits = 0;
			    }
			    var multiplicator = Math.pow(10, digits);
				n = parseFloat((n * multiplicator).toFixed(11));
				var test =(Math.round(n) / multiplicator);
				return +(test.toFixed(2));
			}
        });
    }
);
