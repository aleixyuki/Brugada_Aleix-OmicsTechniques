// (C) Wolfgang Huber 2010-2011

// Script parameters - these are set up by R in the function 'writeReport' when copying the 
//   template for this script from arrayQualityMetrics/inst/scripts into the report.

var highlightInitial = [ true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false ];
var arrayMetadata    = [ [ "1", "GSM1866367", "day0", "cell type: Undifferentiated human induced pluripotent stem cells", "Gene expression of undifferentiated iPSC", "Undifferentiated human induced pluripotent stem cells" ], [ "2", "GSM1866368", "day3", "cell type: Differentiated cells from human induced pluripotent stem cells", "Gene expression of differentiated cells 3 days after the initial differentiation", "Differentiated cells from human induced pluripotent stem cells" ], [ "3", "GSM1866369", "day5", "cell type: Differentiated cells from human induced pluripotent stem cells", "Gene expression of differentiated cells 5 days after the initial differentiation", "Differentiated cells from human induced pluripotent stem cells" ], [ "4", "GSM1866370", "day9-CMs", "cell type: Differentiated cells from human induced pluripotent stem cells", "Gene expression of differentiated cells 9 days after the initial differentiation", "Differentiated cells from human induced pluripotent stem cells" ], [ "5", "GSM1866371", "day21-CMs", "cell type: Differentiated cells from human induced pluripotent stem cells", "Gene expression of differentiated cells 21 days after the initial differentiation", "Differentiated cells from human induced pluripotent stem cells" ], [ "6", "GSM1866372", "day30-CMs", "cell type: Differentiated cells from human induced pluripotent stem cells", "Gene expression of differentiated cells 30 days after the initial differentiation", "Differentiated cells from human induced pluripotent stem cells" ], [ "7", "GSM1866373", "CORIN high", "cell type: Differentiated cells from human induced pluripotent stem cells", "Gene expression of differentiated CMs 30 days after the initial differentiation with high CORIN expression", "Differentiated cells from human induced pluripotent stem cells" ], [ "8", "GSM1866374", "CORIN low", "cell type: Differentiated cells from human induced pluripotent stem cells", "Gene expression of differentiated CMs 30 days after the initial differentiation with low CORIN expression", "Differentiated cells from human induced pluripotent stem cells" ], [ "9", "GSM1866375", "Si HDAC2 1-1", "cell type: Differentiated cells from human induced pluripotent stem cells", "Gene expression of differentiated CMs 30 days after the initial differentiation treated by siHDAC2", "Differentiated cells from human induced pluripotent stem cells" ], [ "10", "GSM1866376", "Si HDAC2 1-2", "cell type: Differentiated cells from human induced pluripotent stem cells", "Gene expression of differentiated CMs 30 days after the initial differentiation treated by siHDAC2", "Differentiated cells from human induced pluripotent stem cells" ], [ "11", "GSM1866377", "Si HDAC2 1-3", "cell type: Differentiated cells from human induced pluripotent stem cells", "Gene expression of differentiated CMs 30 days after the initial differentiation treated by siHDAC2", "Differentiated cells from human induced pluripotent stem cells" ], [ "12", "GSM1866378", "Si HDAC2 2-1", "cell type: Differentiated cells from human induced pluripotent stem cells", "Gene expression of differentiated CMs 30 days after the initial differentiation treated by siHDAC2", "Differentiated cells from human induced pluripotent stem cells" ], [ "13", "GSM1866379", "Si HDAC2 2-2", "cell type: Differentiated cells from human induced pluripotent stem cells", "Gene expression of differentiated CMs 30 days after the initial differentiation treated by siHDAC2", "Differentiated cells from human induced pluripotent stem cells" ], [ "14", "GSM1866380", "Si HDAC2 2-3", "cell type: Differentiated cells from human induced pluripotent stem cells", "Gene expression of differentiated CMs 30 days after the initial differentiation treated by siHDAC2", "Differentiated cells from human induced pluripotent stem cells" ], [ "15", "GSM1866381", "Si NC-1", "cell type: Differentiated cells from human induced pluripotent stem cells", "Gene expression of differentiated CMs 30 days after the initial differentiation treated by siNegative control", "Differentiated cells from human induced pluripotent stem cells" ], [ "16", "GSM1866382", "Si NC-2", "cell type: Differentiated cells from human induced pluripotent stem cells", "Gene expression of differentiated CMs 30 days after the initial differentiation treated by siNegative control", "Differentiated cells from human induced pluripotent stem cells" ], [ "17", "GSM1866383", "Si NC-3", "cell type: Differentiated cells from human induced pluripotent stem cells", "Gene expression of differentiated CMs 30 days after the initial differentiation treated by siNegative control", "Differentiated cells from human induced pluripotent stem cells" ] ];
var svgObjectNames   = [ "pca", "dens" ];

var cssText = ["stroke-width:1; stroke-opacity:0.4",
               "stroke-width:3; stroke-opacity:1" ];

// Global variables - these are set up below by 'reportinit'
var tables;             // array of all the associated ('tooltips') tables on the page
var checkboxes;         // the checkboxes
var ssrules;


function reportinit() 
{
 
    var a, i, status;

    /*--------find checkboxes and set them to start values------*/
    checkboxes = document.getElementsByName("ReportObjectCheckBoxes");
    if(checkboxes.length != highlightInitial.length)
	throw new Error("checkboxes.length=" + checkboxes.length + "  !=  "
                        + " highlightInitial.length="+ highlightInitial.length);
    
    /*--------find associated tables and cache their locations------*/
    tables = new Array(svgObjectNames.length);
    for(i=0; i<tables.length; i++) 
    {
        tables[i] = safeGetElementById("Tab:"+svgObjectNames[i]);
    }

    /*------- style sheet rules ---------*/
    var ss = document.styleSheets[0];
    ssrules = ss.cssRules ? ss.cssRules : ss.rules; 

    /*------- checkboxes[a] is (expected to be) of class HTMLInputElement ---*/
    for(a=0; a<checkboxes.length; a++)
    {
	checkboxes[a].checked = highlightInitial[a];
        status = checkboxes[a].checked; 
        setReportObj(a+1, status, false);
    }

}


function safeGetElementById(id)
{
    res = document.getElementById(id);
    if(res == null)
        throw new Error("Id '"+ id + "' not found.");
    return(res)
}

/*------------------------------------------------------------
   Highlighting of Report Objects 
 ---------------------------------------------------------------*/
function setReportObj(reportObjId, status, doTable)
{
    var i, j, plotObjIds, selector;

    if(doTable) {
	for(i=0; i<svgObjectNames.length; i++) {
	    showTipTable(i, reportObjId);
	} 
    }

    /* This works in Chrome 10, ssrules will be null; we use getElementsByClassName and loop over them */
    if(ssrules == null) {
	elements = document.getElementsByClassName("aqm" + reportObjId); 
	for(i=0; i<elements.length; i++) {
	    elements[i].style.cssText = cssText[0+status];
	}
    } else {
    /* This works in Firefox 4 */
    for(i=0; i<ssrules.length; i++) {
        if (ssrules[i].selectorText == (".aqm" + reportObjId)) {
		ssrules[i].style.cssText = cssText[0+status];
		break;
	    }
	}
    }

}

/*------------------------------------------------------------
   Display of the Metadata Table
  ------------------------------------------------------------*/
function showTipTable(tableIndex, reportObjId)
{
    var rows = tables[tableIndex].rows;
    var a = reportObjId - 1;

    if(rows.length != arrayMetadata[a].length)
	throw new Error("rows.length=" + rows.length+"  !=  arrayMetadata[array].length=" + arrayMetadata[a].length);

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = arrayMetadata[a][i];
}

function hideTipTable(tableIndex)
{
    var rows = tables[tableIndex].rows;

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = "";
}


/*------------------------------------------------------------
  From module 'name' (e.g. 'density'), find numeric index in the 
  'svgObjectNames' array.
  ------------------------------------------------------------*/
function getIndexFromName(name) 
{
    var i;
    for(i=0; i<svgObjectNames.length; i++)
        if(svgObjectNames[i] == name)
	    return i;

    throw new Error("Did not find '" + name + "'.");
}


/*------------------------------------------------------------
  SVG plot object callbacks
  ------------------------------------------------------------*/
function plotObjRespond(what, reportObjId, name)
{

    var a, i, status;

    switch(what) {
    case "show":
	i = getIndexFromName(name);
	showTipTable(i, reportObjId);
	break;
    case "hide":
	i = getIndexFromName(name);
	hideTipTable(i);
	break;
    case "click":
        a = reportObjId - 1;
	status = !checkboxes[a].checked;
	checkboxes[a].checked = status;
	setReportObj(reportObjId, status, true);
	break;
    default:
	throw new Error("Invalid 'what': "+what)
    }
}

/*------------------------------------------------------------
  checkboxes 'onchange' event
------------------------------------------------------------*/
function checkboxEvent(reportObjId)
{
    var a = reportObjId - 1;
    var status = checkboxes[a].checked;
    setReportObj(reportObjId, status, true);
}


/*------------------------------------------------------------
  toggle visibility
------------------------------------------------------------*/
function toggle(id){
  var head = safeGetElementById(id + "-h");
  var body = safeGetElementById(id + "-b");
  var hdtxt = head.innerHTML;
  var dsp;
  switch(body.style.display){
    case 'none':
      dsp = 'block';
      hdtxt = '-' + hdtxt.substr(1);
      break;
    case 'block':
      dsp = 'none';
      hdtxt = '+' + hdtxt.substr(1);
      break;
  }  
  body.style.display = dsp;
  head.innerHTML = hdtxt;
}
