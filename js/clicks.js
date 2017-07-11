define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask"
],
function ( declare, Query, QueryTask ) {
        "use strict";

        return declare(null, {
			makeVariables: function(t){
				// layer IDs
				t.EEZ = 0;
				t.MexicanProvince = 1;
				t.USProtractionArea = 2;
				t.USLeaseBlock = 3;
				t.symLayers = { 
					"USProtractionArea": {   
						"WhaleShark": 5, "SpermWhale": 6, "LoggerheadSeaTurtle": 7, "KempsRidleySeaTurtle": 8, "GulfSturgeon": 9, 
						"GreenSeaTurtle": 10, "BullShark": 11, "BlueMarlin": 12, "AtlanticTarpon": 13, "BluefinTuna": 14,
						"Fish": 15, "SeaTurtles": 16, "MarineMammals": 17, "AllSpecies": 18
					},
					"MexicanProvince": {
						"WhaleShark": 20, "SpermWhale": 21, "LoggerheadSeaTurtle": 22, "KempsRidleySeaTurtle": 23, "GulfSturgeon": 24, 
						"GreenSeaTurtle": 25, "BullShark": 26, "BlueMarlin": 27, "AtlanticTarpon": 28, "BluefinTuna": 29,
						"Fish": 30, "SeaTurtles": 31, "MarineMammals": 32, "AllSpecies": 33 
					},
					"USLeaseBlock": {
						"WhaleShark": 35, "SpermWhale": 36, "LoggerheadSeaTurtle": 37, "KempsRidleySeaTurtle": 38, "GulfSturgeon": 39, 
						"GreenSeaTurtle": 40, "BullShark": 41, "BlueMarlin": 42, "AtlanticTarpon": 43, "BluefinTuna": 44,
						"Fish": 45, "SeaTurtles": 46, "MarineMammals": 47, "AllSpecies": 48, 
					}, 
					"EEZ": {
						"WhaleShark": 50, "SpermWhale": 51, "LoggerheadSeaTurtle": 52, "KempsRidleySeaTurtle": 53, "GulfSturgeon": 54, 
						"GreenSeaTurtle": 55, "BullShark": 56, "BlueMarlin": 57, "AtlanticTarpon": 58, "BluefinTuna": 59,
						"Fish": 60, "SeaTurtles": 61, "AllSpecies": 62, "MarineMammals": 63        
					} 
				}
			},
			eventListeners: function(t){
				$("#" + t.id + "selectScale").chosen({allow_single_deselect:false, width:"240px"})
					.change(function(c){
						t.obj.selectedScale = c.target.value;
						t.obj.visibleLayers = [ t[t.obj.selectedScale] ];
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);	
						$("#" + t.id + "symbolizeBy").val("").trigger("chosen:updated")
						$("#" + t.id + "symByWrap").slideDown();
					});
				$("#" + t.id + "symbolizeBy").chosen({allow_single_deselect:false, width:"240px"})
					.change(function(c){
						t.obj.symbolizeBy = c.target.value;
						t.obj.visibleLayers = [ t.symLayers[t.obj.selectedScale][t.obj.symbolizeBy] ];
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);	
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
