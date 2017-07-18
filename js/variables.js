define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask"
],
function ( declare, Query, QueryTask ) {
        "use strict";

        return declare(null, {
			makeVariables: function(t){
				// layer IDs
				t.EEZ = 1;
				t.MexicanProvince = 3;
				t.USProtractionArea = 5;
				t.USLeaseBlock = 7;
				t.symLayers = { 
					"USProtractionArea": {   
						"WhaleShark": 9, "SpermWhale": 10, "LoggerheadSeaTurtle": 11, "KempsRidleySeaTurtle": 12, "GulfSturgeon": 13, 
						"GreenSeaTurtle": 14, "BullShark": 15, "BlueMarlin": 16, "AtlanticTarpon": 17, "BluefinTuna": 18,
						"Fish": 19, "SeaTurtles": 20, "MarineMammals": 21, "AllSpecies": 22
					},
					"MexicanProvince": {
						"WhaleShark": 24, "SpermWhale": 25, "LoggerheadSeaTurtle": 26, "KempsRidleySeaTurtle": 27, "GulfSturgeon": 28, 
						"GreenSeaTurtle": 29, "BullShark": 30, "BlueMarlin": 31, "AtlanticTarpon": 32, "BluefinTuna": 33,
						"Fish": 34, "SeaTurtles": 35, "MarineMammals": 36, "AllSpecies": 37 
					},
					"USLeaseBlock": {
						"WhaleShark": 39, "SpermWhale": 40, "LoggerheadSeaTurtle": 41, "KempsRidleySeaTurtle": 42, "GulfSturgeon": 43, 
						"GreenSeaTurtle": 44, "BullShark": 45, "BlueMarlin": 46, "AtlanticTarpon": 47, "BluefinTuna": 48,
						"Fish": 49, "SeaTurtles": 50, "MarineMammals": 51, "AllSpecies": 52, 
					}, 
					"EEZ": {
						"WhaleShark": 54, "SpermWhale": 55, "LoggerheadSeaTurtle": 56, "KempsRidleySeaTurtle": 57, "GulfSturgeon": 58, 
						"GreenSeaTurtle": 59, "BullShark": 60, "BlueMarlin": 61, "AtlanticTarpon": 62, "BluefinTuna": 63,
						"Fish": 64, "SeaTurtles": 65, "MarineMammals": 66, "AllSpecies": 67,
					} 
				}
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
