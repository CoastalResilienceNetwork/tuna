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
				// Add dynamic map service
				t.dynamicLayer = new ArcGISDynamicMapServiceLayer(t.url, {opacity: 0.75});
				t.map.addLayer(t.dynamicLayer);
				if (t.obj.visibleLayers.length > 0){	
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				}
				t.dynamicLayer.on("load", function () { 			
					t.layersArray = t.dynamicLayer.layerInfos;
					if (t.obj.stateSet == "no"){
						var ext = t.dynamicLayer.fullExtent;
						t.map.setExtent(ext, true);
					}
					// Save and Share Handler					
					if (t.obj.stateSet == "yes"){
						//extent
						var extent = new Extent(t.obj.extent.xmin, t.obj.extent.ymin, t.obj.extent.xmax, t.obj.extent.ymax, new SpatialReference({ wkid:4326 }))
						t.map.setExtent(extent, true);
						t.obj.stateSet = "no";
					}	
				});	
				t.map.setMapCursor("pointer");
				t.map.on('click',function(c){
					if (t.open == "yes"){
						var pnt = c.mapPoint;
						var q1 = new Query();
						var qt1 = new QueryTask(t.url + "/" + t[t.obj.selectedScale]);
						q1.geometry = pnt;
						q1.outFields = ["*"];
						t.atts = [];
						qt1.execute(q1, function(e){
							t.selFtr = t[t.obj.selectedScale] - 1
							var index = t.obj.visibleLayers.indexOf(t.selFtr);
							if (e.features.length > 0){
								// clear table and chart
								$("#" + t.id + "speciesTb").empty();
								$("#" + t.id + "speciesBox").empty();
								$("#" + t.id + "mig-row-wrap").empty();
								// capture atts
								t.atts = e.features[0].attributes;
								for (var i in t.speciesMeta){
									if (t.atts[i] == 1){
										var x = t.speciesMeta[i];
										var y = i + "_MD";
										// add table rows
										$("#" + t.id + "speciesTb").append(
											"<tr>" +
												"<td class='sp-name'>" + x.Species +"</td>" +
												"<td>" + x.Group + "</td>" +
												"<td>" + t.atts[y] + "% </td>" +
												"<td>" + x.IUCN + "</td>" +
												"<td>" + x.ESA + "</td>" +
												"<td>" + x.NOM + "</td>" +
												"<td>" + x.Res + "</td>" +
												// "<td>" + x.MigTiming + "</td>" +
											"</tr>"
										)
										// build chart
										$("#" + t.id + "mig-row-wrap").append(			
											"<div class='mig-row'>" +
												"<div class='mig-name'>" + x.Species + "</div>" +
												"<div class='mig-lifestage'>Adult Female</div>" +
												"<div class='mig-months first-month mig-" + x.MigChart[0] + "'></div>" +
												"<div class='mig-months mig-" + x.MigChart[1] + "'></div>" +
												"<div class='mig-months mig-" + x.MigChart[2] + "'></div>" +
												"<div class='mig-months mig-" + x.MigChart[3] + "'></div>" +
												"<div class='mig-months mig-" + x.MigChart[4] + "'></div>" +
												"<div class='mig-months mig-" + x.MigChart[5] + "'></div>" +
												"<div class='mig-months mig-" + x.MigChart[6] + "'></div>" +
												"<div class='mig-months mig-" + x.MigChart[7] + "'></div>" +
												"<div class='mig-months mig-" + x.MigChart[8] + "'></div>" +
												"<div class='mig-months mig-" + x.MigChart[9] + "'></div>" + 
												"<div class='mig-months mig-" + x.MigChart[10] + "'></div>" + 
												"<div class='mig-months last-month mig-" + x.MigChart[11] +"'></div>" +
											"</div>" 
										)
										// add juvenile chart
										if (x.MigChartJuv.length > 0){
											$("#" + t.id + "mig-row-wrap").append(			
												"<div class='mig-row'>" +
													"<div class='mig-name'>" + x.Species + "</div>" +
													"<div class='mig-lifestage'>Juvenile</div>" +
													"<div class='mig-months first-month mig-" + x.MigChartJuv[0] + "'></div>" +
													"<div class='mig-months mig-" + x.MigChartJuv[1] + "'></div>" +
													"<div class='mig-months mig-" + x.MigChartJuv[2] + "'></div>" +
													"<div class='mig-months mig-" + x.MigChartJuv[3] + "'></div>" +
													"<div class='mig-months mig-" + x.MigChartJuv[4] + "'></div>" +
													"<div class='mig-months mig-" + x.MigChartJuv[5] + "'></div>" +
													"<div class='mig-months mig-" + x.MigChartJuv[6] + "'></div>" +
													"<div class='mig-months mig-" + x.MigChartJuv[7] + "'></div>" +
													"<div class='mig-months mig-" + x.MigChartJuv[8] + "'></div>" +
													"<div class='mig-months mig-" + x.MigChartJuv[9] + "'></div>" + 
													"<div class='mig-months mig-" + x.MigChartJuv[10] + "'></div>" + 
													"<div class='mig-months last-month mig-" + x.MigChartJuv[11] +"'></div>" +
												"</div>" 
											)
										}	
									}
								}
								console.log("made it")
								// show table and chart
								$("#" + t.id + "click-map").html("Species In Selected Area");
								$("#" + t.id + "click-wrap").slideDown();
								// update layer visibility
								t.layerDefs[t.selFtr] = "OBJECTID = " + t.atts.OBJECTID ;
								t.dynamicLayer.setLayerDefinitions(t.layerDefs);
								if (index == -1){
								 	t.obj.visibleLayers.push(t.selFtr);
								}
								// click listener for table rows
								$("#" + t.id + "speciesTb tr").click(function(c){
									t.sname = $(c.currentTarget).find(".sp-name").html();
									var tmp = t.sname.replace(/\s+/g, '')
									t.obj.symbolizeBy = tmp.replace(/'/g, '')
									$("#" + t.id + "symbolizeBy").val(t.obj.symbolizeBy).trigger("chosen:updated").trigger("change");
								})	
								// click listener chart rows
								$("#" + t.id + " .mig-row").click(function(c){
									t.sname = $(c.currentTarget).find(".mig-name").html();
									var tmp = t.sname.replace(/\s+/g, '')
									t.obj.symbolizeBy = tmp.replace(/'/g, '')
									$("#" + t.id + "symbolizeBy").val(t.obj.symbolizeBy).trigger("chosen:updated").trigger("change");
								})
								// highlight species in chart and table if symbolized
								t.esriapi.rowClicked(t);
							}else{
								// nothing clicked - remove selected layer if visible
								if (index > -1){
								 	t.obj.visibleLayers.splice(index,1)
								}
								// hide chart and table
								$("#" + t.id + "click-wrap").slideUp();
								$("#" + t.id + "click-map").html("Click Map for Species Info");
								t.selFtr = -1;
							}
							// update visibility and set cursor on map
							t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers)	
							t.map.setMapCursor("pointer");
						})	
					}
				})	
			},
			// hightlight species name in chart and table if symbolized by on map
			rowClicked: function(t){
				$("#" + t.id + " .mig-name").each(function(i,v){
					if ( $(v).html()  == t.sname ){
						$(v).addClass("selected-row")
					}else(
						$(v).removeClass("selected-row")	
					)
				})
				$("#" + t.id + " .sp-name").each(function(i,v){
					if ( $(v).html()  == t.sname ){
						$(v).addClass("selected-row")
					}else(
						$(v).removeClass("selected-row")	
					)
				})
			}				
		});
    }
);