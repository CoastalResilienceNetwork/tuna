define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask"
],
function ( declare, Query, QueryTask ) {
        "use strict";

        return declare(null, {
			eventListeners: function(t){
				$("#" + t.id + "selectScale").chosen({allow_single_deselect:true, width:"280px"})
					.change(function(c){
						if (c.currentTarget.selectedIndex > 0){
							// set visible layers
							t.obj.selectedScale = c.target.value;
							t.obj.visibleLayers = [ t[t.obj.selectedScale] ];	
							t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
							// hide chart and table
							$("#" + t.id + "tclick-wrap").slideUp();
							$("#" + t.id + "click-map").html("Click Map for Species Info");
							
							$("#" + t.id + "symByWrap").slideDown();
							$("#" + t.id + "tuna-wrap").slideDown();	
							t.selFtr = -1;
							// trigger click on symbolizeBy select if it has a value
							if (t.obj.symbolizeBy.length > 0){
								$("#" + t.id + "symbolizeBy").val(t.obj.symbolizeBy).trigger("chosen:updated").trigger("change");
							}	
						}
						//hit deselect X
						else{
							// clear visible layers
							t.obj.visibleLayers = [-1];
							t.selFtr = -1;
							t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
							// reset symbolize dropdown
							$("#" + t.id + "symbolizeBy").val("").trigger("chosen:updated").trigger("change")
							// hide table and graph
							$("#" + t.id + "symByWrap").slideUp();
							$("#" + t.id + "tuna-wrap").slideUp();
							$("#" + t.id + "zoom-to-lease").slideUp();
						}
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
						t.esriapi.rowClicked(t);
					});	
				// Species Toggle button
				$("#" + t.id + "speciesToggle input").click(function(c){
					var sp = c.currentTarget.value;
					t.obj.selectedSpecies = c.currentTarget.value;
					// var tmp = t.obj.selectedSpecies.replace(/\s+/g, '')
					// $("#" + t.id + "symbolizeBy").val(tmp).trigger("chosen:updated").trigger("change");
					// update high-level info
					$.each(t.SpecObj,function(i,v){
						if (t.obj.selectedSpecies == v.Species){
							$("#" + t.id + "scientificName").html(v.Scientific_Name)
							$("#" + t.id + "redList").html(v.IUCN_Red_List_Status)
							$("#" + t.id + "spanishCom").html(v.Spanish_CommonName)
						}
					})	
					if (t.efhPres[t.obj.selectedSpecies]){
						$("#" + t.id + "esFishHab").html(t.efhPres[t.obj.selectedSpecies])
					}else{
						$("#" + t.id + "esFishHab").html("None")
					}
					$.each(t.selRegSpecies,function(i,v){
						if (v.SpecName == sp){
							$.each(t.SpecObj,function(j,w){
								if (t.obj.selectedSpecies == w.Species){
									if (w[v.CODE + "_Cons"]){
										var cntry = v.CODE.replace("MEX", "Mexican").replace("USA", "US").replace("CUB", "Cuban")
										$("#" + t.id + "consRegion").html(cntry);
										$("#" + t.id + "consStatus").html(w[v.CODE + "_Cons"])
									}
								}
							})		
						}
					})		

					// add rows to reg table
					$("#" + t.id + "regTb").empty();
					$.each(t.selRegSpecies,function(i,v){
						if (v.SpecName == sp){
							var linkArray = v.Link.split(", ");
							var links = "";
							$.each(linkArray,function(l,y){
								var n = l + 1;
								if (l == 0){
									links = "<a href='" + y + "' target='_blank'>Link " + n + "</a>"
								}else{
									links = links + ", <a href='" + y + "' target='_blank'>Link " + n + "</a>"
								}
							})
							$("#" + t.id + "regTb").append(
								"<tr>" +
									"<td>" + v.Region + "</td>" +
									"<td>" + v.Regulations + "</td>" +
									"<td>" + links + "</td>" +
								"</tr>"
							)	
						}
					})
					// update migratory chart
					$("#" + t.id + "t-mig-row-wrap").empty();	
					$.each(t.SpecObj,function(i,v){
						var sp = v.Species.split(' -')[0]
						if (v.Species == t.obj.selectedSpecies){
							if (v.Migratory_Timing){	
								var mtArray = v.Migratory_Timing.split(", ")
								$("#" + t.id + "t-mig-row-wrap").append(			
									"<div class='t-mig-row'>" +
										"<div class='t-mig-name'>" + v.Species + "</div>" +
										// "<div class='t-mig-lifestage'>temp</div>" +
										"<div class='t-mig-months first-month t-mig-" + mtArray[0] + "'></div>" +
										"<div class='t-mig-months t-mig-" + mtArray[1] + "'></div>" +
										"<div class='t-mig-months t-mig-" + mtArray[2] + "'></div>" +
										"<div class='t-mig-months t-mig-" + mtArray[3] + "'></div>" +
										"<div class='t-mig-months t-mig-" + mtArray[4] + "'></div>" +
										"<div class='t-mig-months t-mig-" + mtArray[5] + "'></div>" +
										"<div class='t-mig-months t-mig-" + mtArray[6] + "'></div>" +
										"<div class='t-mig-months t-mig-" + mtArray[7] + "'></div>" +
										"<div class='t-mig-months t-mig-" + mtArray[8] + "'></div>" +
										"<div class='t-mig-months t-mig-" + mtArray[9] + "'></div>" + 
										"<div class='t-mig-months t-mig-" + mtArray[10] + "'></div>" + 
										"<div class='t-mig-months last-month t-mig-" + mtArray[11] +"'></div>" +
									"</div>" 
								)
							}	
							// IUCN Attributes
							$.each($("#" + t.id + " .iucn-attributeSpan"),function(j,w){
								var field = $(w).attr("id").split("-")[1]
								$("#" + t.id + "-" + field).html( v[field] )
								if (field == "Link"){
									$("#" + t.id + "-" + field).attr("href", v[field])	
								}
							})
						}
					})
				})	

				$("#" + t.id + "dataInfo").click(function(){
					$("#" + t.id + "explain-data-wrap").slideDown();
					$("#" + t.id + "dataInfo").hide();
					$("#" + t.id + "hideDataInfo").css("display", "inline");
				})						
				$("#" + t.id + "hideDataInfo").click(function(){
					$("#" + t.id + "explain-data-wrap").slideUp();
					$("#" + t.id + "dataInfo").show();
					$("#" + t.id + "hideDataInfo").hide();
				});		
				$("#" + t.id + "tableInfo").click(function(){
					$("#" + t.id + "explain-table-wrap").slideDown();
					$("#" + t.id + "tableInfo").hide();
					$("#" + t.id + "hideTableInfo").css("display", "inline");
				})						
				$("#" + t.id + "hideTableInfo").click(function(){
					$("#" + t.id + "explain-table-wrap").slideUp();
					$("#" + t.id + "tableInfo").show();
					$("#" + t.id + "hideTableInfo").hide();
				});	
			}
        });
    }
);
