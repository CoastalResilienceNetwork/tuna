define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask"
],
function ( declare, Query, QueryTask ) {
        "use strict";

        return declare(null, {
			makeVariables: function(t){
				// layer IDs
				t.EEZ = 13;
				t.Fishnet = 15;
				t.ManageedandProtectionAreas = 17;
				t.OilandGasPlanningandUseAreas = 19;
				t.Regulations = 56;
				t.RegObj = [];
				t.SpeciesData = 57;
				t.SpecObj = [];
				t.symLayers = { 
					"EEZ": {
						"AllTunaSpecies":20, 
						"AlbacoreTuna":21, 
						"AtlanticBluefinTuna":22, 
						"AtlanticBonito":23, 
						"BigeyeTuna":24, 
						"BlackfinTuna":25,
						"LittleTunny":26, 
						"SkipjackTuna":27, 
						"YellowfinTuna":28
					}, 
					"Fishnet": {   
						"AllTunaSpecies":29,
						"AlbacoreTuna":30,
						"AtlanticBluefinTuna":31, 
						"AtlanticBonito":32, 
						"BigeyeTuna":33, 
						"BlackfinTuna":34,
						"LittleTunny":35, 
						"SkipjackTuna":36, 
						"YellowfinTuna":37
					},
					"ManageedandProtectionAreas": {
						"AllTunaSpecies":38, 
						"AlbacoreTuna":39, 
						"AtlanticBluefinTuna":40, 
						"AtlanticBonito":41, 
						"BigeyeTuna":42, 
						"BlackfinTuna":43,
						"LittleTunny":44, 
						"SkipjackTuna":45,
						"YellowfinTuna":46 
					},
					"OilandGasPlanningandUseAreas": {
						"AllTunaSpecies":47,
						"AlbacoreTuna":48,
						"AtlanticBluefinTuna":49,
						"AtlanticBonito":50, 
						"BigeyeTuna":51,
						"BlackfinTuna":52,
						"LittleTunny":53,
						"SkipjackTuna":54,
						"YellowfinTuna":55 
					}
				}
				t.speciesCodes = ["ALB", "BON", "BLK", "LTT", "SKJ", "YFT", "BFT", "BET"] 
				t.speciesCodes1 = {
					"ALB": "Albacore Tuna", "BON": "Atlantic Bonito", "BLK": "Blackfin Tuna", "LTT": "Little Tunny", "SKJ": "Skipjack Tuna", 
					"YFT": "Yellowfin Tuna", "BFT": "Atlantic Bluefin Tuna", "BET": "Bigeye Tuna"} 
				// chart data
				t.speciesMeta = {
					"BS": {
						"Species":"Bull Shark", "Group":"Fish", "IUCN":"NT", "ESA":"-", "NOM":"-", "Res":"-",
						"MigTiming":"Migrate in spring (March - May) and fall (September - November)",
						"MigChart":[0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 2, 0], "MigChartJuv":[]
					},
					"WS": {
						"Species":"Whale Shark", "Group":"Fish", "IUCN":"VU", "ESA":"-", "NOM":"TH", "Res":"II",
						"MigTiming":"Year-round migration; Peak migration in May through October",
						"MigChart":[2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2], "MigChartJuv":[]
					},
					"BFT": {
						"Species":"Bluefin Tuna", "Group":"Fish", "IUCN":"EN", "ESA":"-", "NOM":"-", "Res":"-",
						"MigTiming":"Migrate in late winter (Feb - March) and late summer (July - October); Spawn in late Spring (April - June)",
						"MigChart":[0, 2, 2, 3, 3, 3, 2, 2, 2, 2, 0, 0], "MigChartJuv":[]
					},
					"BM": {
						"Species":"Blue Marlin", "Group":"Fish", "IUCN":"VU", "ESA":"-", "NOM":"-", "Res":"-",
						"MigTiming":"Year-round migration; Spawn in late Spring (May - June) and in the fall (September - November)",
						"MigChart":[2, 2, 2, 2, 3, 3, 2, 2, 3, 3, 3, 2], "MigChartJuv":[]
					},
					"AT": {
						"Species":"Atlantic Tarpon", "Group":"Fish", "IUCN":"VU", "ESA":"-", "NOM":"-", "Res":"-",
						"MigTiming":"Migrate in Spring (February - May) and Fall (August - November)",
						"MigChart":[0, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 0], "MigChartJuv":[]
					},
					"GS": {
						"Species":"Gulf Sturgeon", "Group":"Fish", "IUCN":"NT", "ESA":"TH", "NOM":"Ex", "Res":"-",
						"MigTiming":"Migrate in Spring (March - April) and Fall (September - November); Spawn in Summer (May - August)",
						"MigChart":[0, 0, 2, 2, 3, 3, 3, 3, 2, 2, 2, 0], "MigChartJuv":[]
					},
					"KRST": {
						"Species":"Kemp's Ridley Sea Turtle", "Group":"Sea Turtle", "IUCN":"CR", "ESA":"EN", "NOM":"EN", "Res":"-",
						"MigTiming":"Adult females migrate in March and August, and nest on beaches in late spring and summer (April - July). Juveniles migrate in early spring (February - March) and fall (September - November).",
						"MigChart":[0, 0, 2, 3, 3, 3, 3, 2, 0, 0, 0, 0], "MigChartJuv":[0, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 0]
					},
					"LST": {
						"Species":"Loggerhead Sea Turtle", "Group":"Sea Turtle", "IUCN":"EN", "ESA":"TH", "NOM":"EN", "Res":"I",
						"MigTiming":"Migrate in March and October; Nest on beaches from late spring to early fall (April - September)",
						"MigChart":[0, 0, 2, 3, 3, 3, 3, 3, 3, 2, 0, 0], "MigChartJuv":[]
					},
					"GST": {
						"Species":"Green Sea Turtle", "Group":"Sea Turtle", "IUCN":"EN", "ESA":"EN", "NOM":"EN", "Res":"I",
						"MigTiming":"Adult females migrate in May and September, and nest on beaches in summer (June - August). Juveniles migrate in early spring (February - March) and fall (October - November).",
						"MigChart":[0, 0, 0, 0, 2, 3, 3, 3, 2, 0, 0, 0], "MigChartJuv":[0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0]
					},
					"SW": {
						"Species":"Sperm Whale", "Group":"Marine Mammal", "IUCN":"VU", "ESA":"EN", "NOM":"SP", "Res":"-",
						"MigTiming":"Migrate in winter (December - February) and spring (April - May)",
						"MigChart":[2, 2, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2], "MigChartJuv":[]
					}					
				}
			}
        });
    }
);
