define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask"
],
function ( declare, Query, QueryTask ) {
        "use strict";

        return declare(null, {
			eventListeners: function(t){
				$("#" + t.id + "selectScale").chosen({allow_single_deselect:true, width:"240px"})
					.change(function(c){
						if (c.currentTarget.selectedIndex > 0){
							// set visible layers
							t.obj.selectedScale = c.target.value;
							t.obj.visibleLayers = [ t[t.obj.selectedScale] ];
							if (t.obj.selectedScale == "USLeaseBlock"){
								t.obj.visibleLayers.push(t.USProtractionArea)
							}	
							// hide chart and table
							$("#" + t.id + "click-wrap").slideUp();
							$("#" + t.id + "click-map").html("Click Map for Species Info");
							
							$("#" + t.id + "symByWrap").slideDown();
							$("#" + t.id + "species-wrap").slideDown();	
							t.selFtr = -1;
							if (t.obj.selectedScale == "USLeaseBlock"){
								$("#" + t.id + "zoom-to-lease").slideDown();
							}else{
								$("#" + t.id + "zoom-to-lease").slideUp();
							}
						}
						//hit deselect X
						else{
							// clear visible layers
							t.obj.visibleLayers = [-1];
							// reset symbolize dropdown
							$("#" + t.id + "symbolizeBy").val("").trigger("chosen:updated")
							// hide table and graph
							$("#" + t.id + "symByWrap").slideUp();
							$("#" + t.id + "species-wrap").slideUp();
							$("#" + t.id + "zoom-to-lease").slideUp();
						}
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
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
