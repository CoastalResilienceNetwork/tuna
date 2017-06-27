define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask"
],
function ( declare, Query, QueryTask ) {
        "use strict";

        return declare(null, {
			eventListeners: function(t){
				$("#" + t.id + "selectCountry").chosen({allow_single_deselect:true, width:"252px"})
					.change(function(c){
						if (c.target.value.length > 0){
							var val = c.target.value;
							// populate countries select	
							var q = new Query();
							var qt = new QueryTask(t.url + "/5" );
							q.where = "country = '" + val + "'";
							q.returnGeometry = true;
							q.outFields = ["*"];
							qt.execute(q, function(e){
								var stateExtent = e.features[0].geometry.getExtent().expand(1.5);
	            				t.map.setExtent(stateExtent);
							})	
							t.layerDefs1[5] = "country = '" + val + "'";
							t.dynamicLayer1.setLayerDefinitions(t.layerDefs1);
							t.obj.visibleLayers1 = [5];
							t.dynamicLayer1.setVisibleLayers(t.obj.visibleLayers1)
						}else{
							t.obj.visibleLayers1 = [-1];
							t.dynamicLayer1.setVisibleLayers(t.obj.visibleLayers1)
						}	
					});

				$( "#" + t.id + "symbolizeBy input" ).click(function(c){
					t.obj.visibleLayers = [c.target.value];
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
					$(".lyr-stats").slideUp();
					$( "#" + t.id + "lyr-stats-" + c.target.value).slideDown();
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
			},
			abbreviateNumber: function(num) {
			    if (num >= 1000000000) {
			        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
			     }
			     if (num >= 1000000) {
			        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
			     }
			     if (num >= 1000) {
			        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
			     }
			     return num;
			}
        });
    }
);
