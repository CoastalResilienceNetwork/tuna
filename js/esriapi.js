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
				//query regulatory table
				var q = new Query();
				var qt = new QueryTask(t.url + "/" + t.Regulations );
				q.where = "OBJECTID > -1";
				q.returnGeometry = false;
				q.outFields = ["*"];
				var c = [];
				qt.execute(q, function(e){
					$.each(e.features, function(i,v){
						t.RegObj.push(v.attributes)
					})		
				});
				//query species table
				var q = new Query();
				var qt = new QueryTask(t.url + "/" + t.SpeciesData );
				q.where = "OBJECTID > -1";
				q.returnGeometry = false;
				q.outFields = ["*"];
				var c = [];
				qt.execute(q, function(e){
					$.each(e.features, function(i,v){
						t.SpecObj.push(v.attributes)
					})
				});
				// map clicks
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
								$("#" + t.id + "speciesBox").empty();
								
								t.selRegSpecies = [];
								// capture atts
								t.atts = e.features[0].attributes;
								var regs = t.atts.FINALreg.split(", ");
								var spPres = [];
								t.efhPres = {};
								$.each(t.speciesCodes,function(i,v){
									var f = "Max_" + v + "_IUCN";
									if (t.atts[f] == 1){
										spPres.push(v)
									}
									var g = "EFH_" +  v;
									var str = "";
									if (t.atts[g]){
										if (t.atts[g].length > 0){
											str = t.atts[g].replace("JUV", "Juvenile").replace("SEL", "Spawning Egg Larve").replace("ADU", "Adult")
											t.efhPres[t.speciesCodes1[v]] = str
										}	
									}
								})
								$("#" + t.id + "speciesToggle label").addClass("hideClass")
								$.each(t.RegObj,function(i,v){
									var code = v.CODE;
									var species = v.SPECIES;
									$.each(regs,function(j,w){
										if (w == code){
											$.each(spPres,function(k,x){
												if (x == species){
													t.selRegSpecies.push(v);
													var inId = $("#" + t.id + "speciesToggle input[value='" + v.SpecName + "']").attr("id");
													$("label[for='"+ inId +"']").removeClass("hideClass")
												}
											})
										}
									})
								})
								var selsp = $("#" + t.id + "speciesToggle input[value='" + t.obj.selectedSpecies + "']").attr("id")
								if ( !$("label[for='"+ selsp +"']").hasClass("hideClass") ){
									$("#" + selsp).trigger("click")
								}else{
									$.each($("#" + t.id + "speciesToggle label"),function(i,v){
										if ( !$(v).hasClass("hideClass") ){
											var cid = $(v).attr("for")
											$("#" + cid).trigger("click")
											return false
										}
									})								
								}



						
								// show table and chart
								$("#" + t.id + "click-map").html("Species in Selected Area") // <span style='color:#3A72B9;'>" + t.atts.GeoName + "</span>");
								$("#" + t.id + "tclick-wrap").slideDown();
								// update layer visibility
								t.layerDefs[t.selFtr] = "OBJECTID = " + t.atts.OBJECTID ;
								t.dynamicLayer.setLayerDefinitions(t.layerDefs);
								if (index == -1){
								 	t.obj.visibleLayers.push(t.selFtr);
								}
								// click listener chart rows
								$("#" + t.id + " .t-mig-row").click(function(c){
									t.sname = $(c.currentTarget).find(".t-mig-name").html();
									var tmp = t.sname.replace(/\s+/g, '')
									t.obj.symbolizeBy = tmp.replace(/'/g, '')
									$("#" + t.id + "symbolizeBy").val(t.obj.symbolizeBy).trigger("chosen:updated").trigger("change");
								})
							}else{
								// nothing clicked - remove selected layer if visible
								if (index > -1){
								 	t.obj.visibleLayers.splice(index,1)
								}
								// hide chart and table
								$("#" + t.id + "tclick-wrap").slideUp();
								$("#" + t.id + "click-map").html("Click Map for Species Info");
								t.selFtr = -1;
							}
							// update visibility and set cursor on map
							t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers)	
							t.map.setMapCursor("pointer");
						})	
					}
				})	
			}			
		});
    }
);