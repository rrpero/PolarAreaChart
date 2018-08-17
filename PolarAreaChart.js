/*
Ruben Albuquerque
Donut/PieChart Chart using RGraph with options  to  customize

*/

requirejs.config({
//    context: requirejs.s.contexts.sense ? "sense" : null,
    paths: {

        "RGraph": "../extensions/PolarAreaChart/libraries/RGraph.common.core",
		"RGraph.common.dynamic": "../extensions/PolarAreaChart/libraries/RGraph.common.dynamic",
		"RGraph.common.tooltips": "../extensions/PolarAreaChart/libraries/RGraph.common.tooltips",
		"RGraph.rose": "../extensions/PolarAreaChart/libraries/RGraph.rose",
		"RGraph.common.key": "../extensions/PolarAreaChart/libraries/RGraph.common.key"
    },
 /*   shim: {
        "RGraph": {
         //   deps: ["RGraph.rose"],
            exports: "RGraph"
        },
        "RGraph.common.dynamic": {
           deps: ["RGraph"]
           //, exports: "RGraph"
        },
        "RGraph.common.tooltips": {
           deps: ["RGraph"]
           //, exports: "RGraph"
        },
        "RGraph.rose": {
           deps: ["RGraph"]
           //, exports: "RGraph"
        },
        "RGraph.common.key": {
           deps: ["RGraph"]
           //, exports: "RGraph"
        }
    },*/
    waitSeconds: 60
})



define( [
		'jquery'
		,'qlik'
        ,'./properties/properties'
		,'./properties/initialProperties',
		"RGraph",
		"RGraph.rose",
		"RGraph.common.dynamic",
		"RGraph.common.tooltips",
		"RGraph.common.key"
//		,'./libraries/RGraph.common.core'	
//		,'./libraries/RGraph.common.dynamic'
//		,'./libraries/RGraph.common.tooltips'
//		,'./libraries/RGraph.rose'
//		,'./libraries/RGraph.common.key'
		,'./libraries/rainbowvis'


		
    ],
	
    function ( $, qlik, props, initProps) {
        'use strict';	
		//window.RGraph={isRGraph: true};
		//Inject Stylesheet into header of current document
		//$( '<style>' ).html(styleSheet).appendTo( 'head' );
		
        return {
			//window.RGraph=RGraph;
			//Define the properties tab - these are defined in the properties.js file
             definition: props,
			
			//Define the data properties - how many rows and columns to load.
			 initialProperties: initProps,
			
			//Allow export to print object 
			support : { export: true,
						snapshot:true
			},
			
			//Not sure if there are any other options available here.
			 snapshot: {cantTakeSnapshot: true
			 },

			//paint function creates the visualisation. - this one makes a very basic table with no selections etc.
            paint: function ($element, layout) {
				
				
				
			 var lastrow = 0, me = this;
			 //loop through the rows we have and render
			 var rowCount=this.backendApi.getRowCount();
			 var qMatrix =[];
			 this.backendApi.eachDataRow( function ( rownum, row ) {
						lastrow = rownum;
						if(typeof row[1] !== 'undefined')
							qMatrix[rownum]=row;
						//do something with the row..	
						if((lastrow+1)==rowCount){
							//console.log("row "  + row);
							//console.log("last "  + lastrow);
							//console.log("Row Count " +rowCount);
							
							paintAll($element,layout,qMatrix);
							//console.log("New qMatrix " +qMatrix.length);
							
						}
						
			 });
			 //console.log("last "  + lastrow);
			 //console.log("Row Count " +this.backendApi.getRowCount());
			 if(this.backendApi.getRowCount() > lastrow +1){
					 //we havent got all the rows yet, so get some more, 1000 rows
					  var requestPage = [{
							qTop: lastrow + 1,
							qLeft: 0,
							qWidth: 3, //should be # of columns
							qHeight: Math.min( 100, this.backendApi.getRowCount() - lastrow )
						}];
					   this.backendApi.getData( requestPage ).then( function ( dataPages ) {
								//when we get the result trigger paint again
								me.paint( $element,layout );
					   } );
			 }
			 else{

				 
			 }
			 function paintAll($element,layout,qMatrix)
			 {

				if(typeof(layout.minTextSize) == "undefined")
					layout.minTextSize=15;	
				if(typeof(layout.maxTextSize) == "undefined")
					layout.maxTextSize=16;	
				if(typeof(layout.palette) == "undefined")
					layout.palette="analogue1";	
				if(typeof(layout.border) == "undefined")
					layout.border=false;
				if(typeof(layout.backgroundColor) == "undefined"){
					layout.backgroundColor={};				
					layout.backgroundColor['color']="white;"
					layout.backgroundColor['color']="rgba(255,255,255,0);"
				}
				if(typeof(layout.bold) == "undefined")
					layout.bold="bold";				
				if(typeof(layout.capitalize) == "undefined")
					layout.capitalize="upper";					



			 
						
				if(typeof(layout.labelTextSize) == "undefined")
					layout.labelTextSize=100;	
	
				if(typeof(layout.labelDistance) == "undefined")
					layout.labelDistance=10;

				var app = qlik.currApp(this);
				var html="";
				
				// Get the Number of Dimensions and Measures on the hypercube
				var numberOfDimensions = layout.qHyperCube.qDimensionInfo.length;
				//console.log(numberOfDimensions);
				var numberOfMeasures = layout.qHyperCube.qMeasureInfo.length;
				//console.log(numberOfMeasures);
				
				// Get the Measure Name and the Dimension Name
				var measureName = layout.qHyperCube.qMeasureInfo[0].qFallbackTitle;
				//console.log(measureName);
				var dimensionName = layout.qHyperCube.qDimensionInfo[0].qFallbackTitle;
				//console.log(dimensionName);

				
				// Get the number of fields of a dimension
				//var numberOfDimValues = layout.qHyperCube.qDataPages[0].qMatrix.length;
				var numberOfDimValues = qMatrix.length;
				console.log("qMatrix.length: " + numberOfDimValues);
				
				//console.log(qMatrix);
				//console.log(layout);
				var numberOfItems = numberOfDimValues;


				
				
				
				// Get the values of the dimension
				var dimMeasArray=[];
				var dimArray =[];
				var measArrayNum =[];
				var measArrayText =[];
				var total= 0;
				var palette =["RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)"];	
				
				var rainbow = new Rainbow(); 
				
				var newStructure ={};
				for (var i=0; i<numberOfDimValues;i++){
					newStructure[qMatrix[i][0].qText]={};
					//[qMatrix[i][1].qText]=qMatrix[i][2].qNum;
				}
				
				var newStructureDim2 ={};
				for (var i=0; i<numberOfDimValues;i++){
					newStructureDim2[qMatrix[i][1].qText]=qMatrix[i][1].qNum;
					//console.log(newStructureDim2[qMatrix[i][1].qText]);
					//[qMatrix[i][1].qText]=qMatrix[i][2].qNum;
				}

				/*function sortOnKeys(dict) {

					var sorted = [];
					for(var key in dict) {
						sorted[sorted.length] = key;
					}
					sorted.sort(function(a,b){
						return dict[b]-dict[a];
					});

					var tempDict = {};
					for(var i = 0; i < sorted.length; i++) {
						tempDict[sorted[i]] = dict[sorted[i]];
					}

					return tempDict;
				}

				newStructureDim2 = sortOnKeys(newStructureDim2);				
				*/
				
				rainbow.setNumberRange(0, Object.keys(newStructureDim2).length+1);
				
				
				function hexToRgb(hex) {
					// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
					var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
					hex = hex.replace(shorthandRegex, function(m, r, g, b) {
						return r + r + g + g + b + b;
					});

					var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
					return result ? {
						r: parseInt(result[1], 16),
						g: parseInt(result[2], 16),
						b: parseInt(result[3], 16)
					} : null;
				}				
				
				var borderBlack=[];
				function  getPalette(rainbowP){
					var s = [];
					for (var i = 0; i <= numberOfItems; i++) {
						var hexColour = rainbowP.colourAt(i);
						s[i]= '#' + hexColour;
						var rgb=hexToRgb(s[i]);
						s[i]= 'RGBA('+rgb.r+ ',' + rgb.g + ',' + rgb.b+ ',0.8)';
						borderBlack[i]="#000000";
					}
					return  s;
				}
				
				//rainbow.setSpectrum('#662506', '#993404', '#cc4c02', '#ec7014', '#fb9a29', '#fec44f','#FEE391');
				//azul2
				//rainbow.setSpectrum('#09304E', '#203B4E', '#11609B')
				//azul1
				//rainbow.setSpectrum('#FFFFFF','#11609B');
				//azul-marrom				
				//rainbow.setSpectrum('#02089B', '#353768', '#177FCE', '#D48B4D', '#9B3202');
				//analogas 1
				if(layout.palette=="analogue1"){
					rainbow.setSpectrum('#A500DB', '#006EE5', '#00CE36', '#E5D300', '#DB5800');
					palette=getPalette(rainbow);
				}
				if(layout.palette=="analogue2"){
					rainbow.setSpectrum('#3BDB00', '#E5A900', '#CE1A00', '#7500E5', '#00A2DB');
					palette=getPalette(rainbow);
				}
				if(layout.palette=="yellowRed"){
					rainbow.setSpectrum('#C7DB00','E5B800','CE7800','E53D00', '#DB0029');
					palette=getPalette(rainbow);
				}
				if(layout.palette=="whiteBlue"){
					rainbow.setSpectrum('#D7FFF0','#90E8E8','#34B9FF','#0047E8','#0B00FF');					
					palette=getPalette(rainbow);
				}
				if(layout.palette=="brazil"){
					rainbow.setSpectrum('#0025FF','#FFFB00','#FFFB00','#FFFB00','#FFFB00','#FFFB00','#FFFB00','#FFFB00','#FFFB00','#00D108');					
					palette=getPalette(rainbow);
				}				
				if(layout.palette=="colored"){
					//rainbow.setSpectrum('#D7FFF0','#90E8E8','#34B9FF','#0047E8','#0B00FF');					
					palette=getPalette(rainbow);
				}	



				


				
				var	paletteBlue=["#051D5C","#0F2662","#193068","#23396E","#2D4374","#374C7A","#415680","#4C5F86","#56698C","#607292","#6A7C98","#74859E","#7E8FA4","#8998AA","#93A2B0","#9DABB6","#A7B5BC","#B1BEC2","#BBC8C8","#C5D2CF"];
				var paletteGreen=["#034502","#0D4C0C","#185316","#225B20","#2D622B","#376A35","#42713F","#4C784A","#578054","#61875E","#6C8F69","#769673","#819E7D","#8BA588","#96AC92","#A0B49C","#ABBBA7","#B5C3B1","#C0CABB","#CBD2C6"];
				var paletteRed=["#940005","#97090D","#9B1216","#9F1C1F","#A32528","#A62E31","#AA383A","#AE4142","#B24A4B","#B65454","#B95D5D","#BD6766","#C1706F","#C57977","#C98380","#CC8C89","#D09592","#D49F9B","#D8A8A4","#DCB2AD"];
				
				var paletteYellowWhite =["#ffc22b","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)"];
				
				var paletteWhiteYellow =["rgba(0,0,0,0)","#ffc22b","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)"];

				var paletteBlueWhite =["RGB(141,170,203)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)"];			
				var paletteWhiteBlue =["rgba(0,0,0,0)","RGB(141,170,203)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)"];
				
				var paletteRedWhite =["RGB(252,115,98)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)"];
				
				
				var paletteWhiteRed =["rgba(0,0,0,0)","RGB(252,115,98)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)"];			
				
				if(numberOfDimValues<=6){
					paletteBlue=["#051D5C","#2D4374","#56698C","#7E8FA4","#A7B5BC","#C5D2CF"];
					paletteGreen=["#034502","#2D622B","#578054","#819E7D","#ABBBA7","#CBD2C6"];
					paletteRed=["#940005","#A32528","#B24A4B","#C1706F","#D09592","#DCB2AD"];				
				}
				else if(numberOfDimValues<=10){
					paletteBlue=["#051D5C","#193068","#2D4374","#415680","#56698C","#6A7C98","#7E8FA4","#93A2B0","#A7B5BC","#BBC8C8"];
					paletteGreen=["#034502","#185316","#2D622B","#42713F","#578054","#6C8F69","#819E7D","#96AC92","#ABBBA7","#C0CABB"];
					paletteRed=["#940005","#9B1216","#A32528","#AA383A","#B24A4B","#B95D5D","#C1706F","#C98380","#D09592","#D8A8A4"];				
				}
				
				var paletteBG=
				[
				'Gradient(white:RGB(141,170,203))',
						'Gradient(white:#ff0:#aa0:#660)', 'Gradient(white:#f00:#a00:#600)',
						'Gradient(white:#0ff:#0aa:#066)', 'Gradient(white:#0f0:#0a0:#060)',
						'Gradient(white:#fff:#aaa:#666)', 'Gradient(white:#f0f:#a0a:#606)',
						'Gradient(white:#ff0:#aa0:#660)','Gradient(white:#f00:#a00:#600)',
						'Gradient(white:#0ff:#0aa:#066)','Gradient(white:#0f0:#0a0:#060)',
						'Gradient(white:#fff:#aaa:#666)', 'Gradient(white:#f0f:#a0a:#606)',
						'Gradient(white:#fff:#aaa:#666)'			];
						
				//palette=paletteBG;
				if(layout.palette=="default")
					palette=palette;
				else if(layout.palette=="bluegradient")
					palette=paletteBlue;
				else if(layout.palette=="redgradient")
					palette=paletteRed;
				else if(layout.palette=="greengradient")
					palette=paletteGreen;
				else if(layout.palette=="paletteBG")
					palette=paletteBG;			
				else if(layout.palette=="yellowwhite")
					palette=paletteYellowWhite;	
				else if(layout.palette=="whiteyellow")
					palette=paletteWhiteYellow;				
				else if(layout.palette=="redwhite")
					palette=paletteRedWhite;	
				else if(layout.palette=="whitered")
					palette=paletteWhiteRed;	
				else if(layout.palette=="bluewhite")
					palette=paletteBlueWhite;	
				else if(layout.palette=="whiteblue")
					palette=paletteWhiteBlue;		
				
				/** TODO Pedir decimal e milhar do QS **/
				var  measArrayNum2 = [];
				var paletteKeep = [];
				var valueBelow = "--";
				if(layout.valueBelow)
					valueBelow = "\\n";


				if(numberOfDimensions==2){				
					for(var  i  in newStructure){
						//console.log(i);
						for(var  j  in newStructureDim2){
							newStructure[i][j]=0;
						}
					}				


					for (var i=0; i<numberOfDimValues;i++){
						newStructure[qMatrix[i][0].qText][qMatrix[i][1].qText]=qMatrix[i][2].qNum;
						//console.log(qMatrix[i][0].qText);
						//console.log(qMatrix[i][1].qText);
						//[qMatrix[i][1].qText]=qMatrix[i][2].qNum;
					}

					var  toolTipsArray = [];
					var ix=0;
					var itpx=0
					for(var  i  in newStructure){
						//console.log(i);
						var arrayValuesDim2=[]
						var tpuniq = [];
						var jx=0;
						for(var  j  in newStructureDim2){
							arrayValuesDim2[jx]=newStructure[i][j];
							//tpuniq[jx]= i+" - " + j + " - " + newStructure[i][j];
							
							jx++;
							toolTipsArray[itpx]=i+" - " + j + " - " + newStructure[i][j];
							itpx++;
						}
						measArrayNum2[ix]=arrayValuesDim2;
						//toolTipsArray[ix]=tpuniq;
						ix++;
					}

					
				}
				else
				{
					for(var  i  in newStructure){
						newStructure[i]=0;
					}	
					for (var i=0; i<numberOfDimValues;i++){
						newStructure[qMatrix[i][0].qText]=qMatrix[i][1].qNum;

					}
					
					var  toolTipsArray = [];
					var ix=0;
					var itpx=0
					for(var  i  in newStructure){
						//console.log(i);
						var arrayValuesDim2//=[];

						//arrayValuesDim2[ix]
						=  newStructure[i];

						toolTipsArray[itpx]=i+" - " + newStructure[i];
						itpx++;
						
						measArrayNum2[ix]=arrayValuesDim2;
						ix++;
					}					
					
					
				}	
				
				


				//console.log(toolTipsArray);				
				

				//console.log("new");
				//console.log(newStructure);

				//console.log("num dim values " + numberOfDimValues);
				for (var i=0; i<numberOfDimValues;i++){

					//paletteKeep[i]=palette[layout.qHyperCube.qDataPages[0].qMatrix[i][0].qElemNumber];
					paletteKeep[i]=palette[qMatrix[i][0].qElemNumber];
					//dimArray[i] = layout.qHyperCube.qDataPages[0].qMatrix[i][0].qText;
					dimArray[i] = qMatrix[i][0].qText;
					//console.log(qMatrix[i][1].qText+qMatrix[i][0].qText)
					//if(dimArray[i]=="Thresh")
					//	console.log("Thresh  tem elem  number "  + qMatrix[i][0].qElemNumber);
					//measArrayNum[i] = layout.qHyperCube.qDataPages[0].qMatrix[i][1].qNum;
					measArrayNum[i] = qMatrix[i][1].qNum;
					
					//measArrayNum2[]
					
					//measArrayNum2[i]=[qMatrix[i][1].qNum,qMatrix[i][1].qNum/2];
					
					
					//console.log(qMatrix[i][0]);
					//console.log(qMatrix[i]);
					//measArrayText[i] = layout.qHyperCube.qDataPages[0].qMatrix[i][1].qText;
					measArrayText[i] = qMatrix[i][1].qText;
					//dimMeasArray[i] = dimArray[i] + valueBelow +measArrayText[i];
					dimMeasArray[i] = dimArray[i] + valueBelow +measArrayText[i];
					
					total=total+parseFloat(measArrayNum[i]);	
					//console.log(dimArray[i]+"-"+measArrayNum[i]);
					
				}
				
				
				
				//% to Only Values
				var measArrayPerc = [];
				//var measArrayValue = [];
				
				var dimMeasPercArray=[];
				var dimMeasPercTPArray=[];			
				
				var origin=-Math.PI/2;
				var originAcc = 0;
				for (var i=0; i<numberOfDimValues;i++){
					
					
					var measPercArray = (parseFloat(measArrayNum[i])/total)*100;
										
					measPercArray= parseFloat(measPercArray).toFixed(1);					
					measArrayPerc[i]=measPercArray + "%";
										
					dimMeasPercArray[i] = dimArray[i] +valueBelow +measPercArray + "%";
					dimMeasPercTPArray[i] = dimensionName+'</br>' +
											'<div style="color:' + palette[i]+';">' + dimArray[i]+": " +measArrayText[i]+"</div>" +
											"Percentual: " + measPercArray + "%";
								
				}

				var dimensionLength=qMatrix.length;
								
				//To generate random numbers to allow multiple charts to present on one sheet:
				function guid() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();};
				function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);};
				var tmpCVSID = guid();
					

				function capitalize(str) {
				
					if(layout.capitalize=="capitalize"){
						return str
							.toLowerCase()
							.split(' ')
							.map(function(word) {
								//console.log("First capital letter: "+word[0]);
								//console.log("remain letters: "+ word.substr(1));
								return word[0].toUpperCase() + word.substr(1);
							})
							.join(' ');
					}
					return str.toUpperCase();
				}

					
				var hashCode = function(str){
					var hash = 0;
					if (str.length == 0) return hash;
					for (i = 0; i < str.length; i++) {
						var char = str.charCodeAt(i);
						hash = ((hash<<5)-hash)+char;
						hash = hash & hash; // Convert to 32bit integer
					}
					//console.log(Math.abs(hash));
					return Math.abs(hash);
				}

				var html = '';			
				var width = $element.width(), height = $element.height();
				// add canvas for chart			
				html+='<div style="background-color: '+ layout.backgroundColor.color +';" id="canvas-wrapper-'+tmpCVSID+'"><canvas id="' + tmpCVSID + '" width="'+width+'" height="'+height+'">[No canvas support]</canvas></div><div id="myKey-'+tmpCVSID+'"></div>';
//onsole.log(html);


				$element.html(html);
				
				
				var testRadius = width;
				if(width>height)
					testRadius=height;
				testRadius=testRadius*(layout.chartRadius/75);
				
				
				//RGraph.Reset(document.getElementById(tmpCVSID));
				var min = Math.min.apply(null, measArrayNum),
				max = Math.max.apply(null, measArrayNum);
				
				var diffMaxMin = max - min;
				

				
				var  maxTextSize = 20-layout.maxTextSize;
				if(width>height){
					tamanho=height;
					var  tamanho2=height/maxTextSize;
					//if((width/1.5)>height)
					//	var tamanho=height/2;
					
				}
				else{
					var tamanho=width;
					var  tamanho2=width/maxTextSize;
					//if((height/1.5)>=width)
					//	var tamanho=width/2;
				}
				
				if(measArrayNum.length>50)
					tamanho2=tamanho2-(tamanho2/5);
				
				tamanho=tamanho * (Math.log(measArrayNum.length)); 
				//console.log("LOG: " + Math.log(1000000*measArrayNum.length));
				//tamanho = height+width;				
				var fontMax =  5 + ((max/total)*tamanho);

					
				/*console.log(dimArray.map(function(d,i) {
					  return {text: d, size: 10+measArrayNum[i], test: "haha"};
					}));*/
				var padding=3;
				if(layout.border)
					padding=padding+1;
				var font="QlikView Sans";
				//console.log(measArrayNum2);
				//console.log(Object.keys(newStructure));
				var rose = new RGraph.Rose({
					//id: 'canvas-wrapper-'+tmpCVSID,
					id: tmpCVSID,
					data: measArrayNum2/*[
					
						[4,8,6,5],
						[4,5,1,2],
						[2,5,9,1],
						[6,5,8,8],
						[1,3,5,9],
						[4,6,8,5],
						[4,5,6,3]
					]*/,
					options: {
						//variant: 'non-equi-angular',
						backgroundAxes:false,
						radius:testRadius,
						labelsAxes:'n',
						textFont:'QlikView Sans',
						labelsBoxed:false,
						textSize:10,
						textSizeScale:7,
						backgroundGridColor: '#989080',
						//tooltips: toolTipsArray,
						tooltips:function (idx)
						{
							return '<div id="__tooltip_div__">'+toolTipsArray[idx]+'</div>';
								   //'s stats<br/><canvas id="__tooltip_canvas__" width="400" height="150">='
								   //'[No canvas support]</canvas>';
							},
						tooltipsEvent: 'onmousemove',
						colorsSequential: numberOfDimensions==2?false:true/*[
						
							'a','b','c','d',
							'e','f','g','h',
							'i','j','k','l',
							'm','n','o','p',
							'q','r','s','t',
							'u','v','w','x',
							'y','z','aa','bb'
						]*/,
						colors: palette,
						linewidth: 0,
						labels: Object.keys(newStructure),
						//exploded: 3,
						//strokestyle:'rgba(0,0,0,0.8)',
						backgroundGridLinewidth:1,
						key:numberOfDimensions==2?Object.keys(newStructureDim2):Object.keys(newStructure),
						eventsClick: onClickDimension
					}
				}).draw()
				.on('tooltip', function (obj)
				{
					//console.log(obj);
					
					//var tooltip = obj.get('tooltips');
					//var colors  = rose.properties.colors;
					
					//$("#__tooltip_div__").css('border','4px solid ' + colors[obj.__index__]);
					//tooltip.style.border = '4px solid ' + colors[obj.__index__]
				});
				
				RGraph.tooltips.style.backgroundColor = 'white';
				RGraph.tooltips.style.color           = 'black';
				RGraph.tooltips.style.fontWeight      = 'bold';
				RGraph.tooltips.style.boxShadow       = 'none';
				
				
				
				rose.canvas.onmouseout = function (e)
				{
					// Hide the tooltip
					RGraph.hideTooltip();
					
					// Redraw the canvas so that any highlighting is gone
					RGraph.redraw();
				}
				//needed for export
				
				function onClickDimension (e, shape)
				{
					var index = shape.index;
					//alert(dimensionName);
					//console.log(index);
					var ix=0;
					for(var  i in newStructure){
						for(var  j in newStructure[i]){
							if(ix==index)
								app.field(dimensionName).toggleSelect(i, true);
							ix++;
						}
						//console.log(i);
					}
					//if(index==1)
					
					//app.field(dimensionName).toggleSelect(dimArray[index], true);
					return  true;
				}				
				return qlik.Promise.resolve();	
			 }
		}	
		
		
		
	};

} );
