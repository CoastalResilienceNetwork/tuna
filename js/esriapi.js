define([
	"esri/layers/ArcGISDynamicMapServiceLayer", "esri/geometry/Extent", "esri/SpatialReference", "esri/tasks/query" ,"esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", 
	"esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol","esri/symbols/SimpleMarkerSymbol", "esri/graphic", "dojo/_base/Color"
],
function ( 	ArcGISDynamicMapServiceLayer, Extent, SpatialReference, Query, QueryTask, declare, FeatureLayer, 
			SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, Graphic, Color ) {
        "use strict";

        return declare(null, {
			esriApiFunctions: function(t){
				t.layerDefs = [];	
				t.layerDefs1 = [];	
				// Add dynamic map service
				t.dynamicLayer = new ArcGISDynamicMapServiceLayer(t.url);
				t.dynamicLayer1 = new ArcGISDynamicMapServiceLayer(t.url, {opacity:0.5});
				t.map.addLayer(t.dynamicLayer1);
				t.map.addLayer(t.dynamicLayer);
				if (t.obj.visibleLayers.length > 0){	
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				}
				t.dynamicLayer.on("load", function () { 			
					t.layersArray = t.dynamicLayer.layerInfos;
					if (t.obj.stateSet == "no"){
						t.map.setZoom(2);
					}
					// Save and Share Handler					
					if (t.obj.stateSet == "yes"){
						//extent
						var extent = new Extent(t.obj.extent.xmin, t.obj.extent.ymin, t.obj.extent.xmax, t.obj.extent.ymax, new SpatialReference({ wkid:4326 }))
						t.map.setExtent(extent, true);
						t.obj.stateSet = "no";
					}	
				});		
				// populate countries select	
				var q = new Query();
				var qt = new QueryTask(t.url + "/0" );
				q.where = "OBJECTID > 0";
				q.returnGeometry = false;
				q.outFields = ["*"];
				var c = [];
				qt.execute(q, function(e){
					$.each(e.features, function(i,v){
						c.push(v.attributes.Country)
					})
					var c1 = _.uniq(c)
					var countries = c1.sort();
					$.each(countries,function(i,v){
						$('#' + t.id + 'selectCountry').append("<option value='" + v + "'>"+ v +"</option")
					})	
					$('#' + t.id + 'selectCountry').trigger("chosen:updated");
					// Trigger symbolize by click
					$( "#" + t.id + "symbolizeBy input[value=" + t.obj.symbolizeBy + "]" ).trigger("click");		
					$( "#" + t.id + "pickHabDes input[value=" + t.obj.pickHabDes + "]" ).trigger("click");		
				});
				// handle map clicks
				t.map.setMapCursor("pointer")
				t.map.on('click',function(c){
					if (t.open == "yes"){
						var centerPoint = new esri.geometry.Point(c.mapPoint.x,c.mapPoint.y,c.mapPoint.spatialReference);
						var mapWidth = t.map.extent.getWidth();
						var mapWidthPixels = t.map.width;
						var pixelWidth = mapWidth/mapWidthPixels;
						// change the tolerence below to adjust how many pixels will be grabbed when clicking on a point or line
						var tolerance = 10 * pixelWidth;
						var pnt = c.mapPoint;
						var ext = new esri.geometry.Extent(1,1, tolerance, tolerance, c.mapPoint.spatialReference);	
						var pnt = c.mapPoint;
						var q1 = new Query();
						var qt1 = new QueryTask(t.url + "/0");
						q1.geometry = ext.centerAt(centerPoint);
						q1.outFields = ["*"];
						t.atts = [];
						qt1.execute(q1, function(e){
							var index = t.obj.visibleLayers.indexOf(0);
							if (e.features.length > 0){
								t.atts = e.features[0].attributes;
								$.each( $(".atts-section .nd_atts"), function(i,v){
									var field = v.id.split("-").pop()
									var val = t.atts[field]
									if ( isNaN(t.atts[field]) == false ){
										val = Math.round(val);
										val = t.clicks.commaSeparateNumber(val);
									}
									if (val == -999){
										val = "No Data"
									}	
									$('#' + v.id).html(val)
									$(".attWrap").slideDown();
								})
								t.layerDefs[0] = "OBJECTID = " + t.atts.OBJECTID ;
								t.dynamicLayer.setLayerDefinitions(t.layerDefs);
								if (index == -1){
									t.obj.visibleLayers.push(0);
								}	
							}else{
								if (index > -1){
									t.obj.visibleLayers.splice(index,1)
								}
								$(".attWrap").slideUp();
								$("#" + t.id + "-Project_Title").html("Click Projects for More Info")
							}
							t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers)	
						})	
					}
				})
			}				
		});
    }
);