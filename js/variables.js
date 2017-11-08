define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask"
],
function ( declare, Query, QueryTask ) {
        "use strict";

        return declare(null, {
			makeVariables: function(t){
				// layer IDs
				t.obis = 0;
				t.obisSpec = ["Atlantic Bluefin Tuna", "Bigeye Tuna", "Blackfin Tuna", "Skipjack Tuna", "Yellowfin Tuna"]
				t.EEZ = 14;
				t.Fishnet = 16;
				t.ManageedandProtectionAreas = 18;
				t.OilandGasPlanningandUseAreas = 20;
				t.Regulations = 57;
				t.RegObj = [];
				t.SpeciesData = 58;
				t.SpecObj = [];
				t.symLayers = { 
					"EFH": {
						"ALBADU": 1,
						"ALBJUV": 2,
						"BFTADU": 3,
						"BFTSEL": 4,
						"BETADU": 5,
						"BETJUV": 6,
						"SKJADU": 7,
						"SKJJUV": 8,
						"SKJSEL": 9,
						"YFTADU": 10,
						"YFTJUV": 11,
						"YFTSEL": 12
					},
					"EEZ": {
						"AllTunaSpecies":21, 
						"AlbacoreTuna":22, 
						"AtlanticBluefinTuna":23, 
						"AtlanticBonito":24, 
						"BigeyeTuna":25, 
						"BlackfinTuna":26,
						"LittleTunny":27, 
						"SkipjackTuna":28, 
						"YellowfinTuna":29
					}, 
					"Fishnet": {   
						"AllTunaSpecies":30,
						"AlbacoreTuna":31,
						"AtlanticBluefinTuna":32, 
						"AtlanticBonito":33, 
						"BigeyeTuna":34, 
						"BlackfinTuna":35,
						"LittleTunny":36, 
						"SkipjackTuna":37, 
						"YellowfinTuna":38
					},
					"ManageedandProtectionAreas": {
						"AllTunaSpecies":39, 
						"AlbacoreTuna":40, 
						"AtlanticBluefinTuna":41, 
						"AtlanticBonito":42, 
						"BigeyeTuna":43, 
						"BlackfinTuna":44,
						"LittleTunny":45, 
						"SkipjackTuna":46,
						"YellowfinTuna":47 
					},
					"OilandGasPlanningandUseAreas": {
						"AllTunaSpecies":48,
						"AlbacoreTuna":49,
						"AtlanticBluefinTuna":50,
						"AtlanticBonito":51, 
						"BigeyeTuna":52,
						"BlackfinTuna":53,
						"LittleTunny":54,
						"SkipjackTuna":55,
						"YellowfinTuna":56 
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
