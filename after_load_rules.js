//Run - All Tags - After Load Rules


//Custom Lowercasing
//Exceptions object value doesnt matter
var exceptions = {
    'gclid' : 1,
    'qp.gclid': 1
};
for (var property in utag.loader.GV(b)) {
    try {
        if (!exceptions[property]) {
            b[property] = (b[property] instanceof Array || b[property] instanceof Object) ? b[property] : b[property].toString().toLowerCase();
        }
    } catch (e) {}
}

//Prioritize Audiences
var audience_lst = [];
var dl = utag_data||b;
for(k in dl) {
if(k.indexOf('va.audiences')>=0 && dl[k].indexOf('_')>=0)
    audience_lst.push(dl[k].split('_')[0]);
}
//console.log(audience_lst);
if(audience_lst.length > 0) {
    audience_lst = Array.from(new Set(audience_lst));
    tmp_lst = [];
    for(var i=0; i<audience_lst.length; i++) {
    if(!isNaN(parseInt(audience_lst[i])))
        tmp_lst.push(audience_lst[i]);
}
    utag_data.audience_list = tmp_lst.join(',');
    b.audience_list = tmp_lst.join(',');
    var aid = aid_prioritize(audience_lst);
    utag_data.audience_qualifier = aid;
    b.audience_qualifier = aid;
}


//Clicktale Mapping
if (document.cookie.indexOf("WRUID") > -1 && document.cookie.indexOf("_CT_RS_") > -1 && window.localStorage && localStorage.getItem("ClicktalePID") && localStorage.getItem("ClicktaleUID")) {
    var p = (localStorage.getItem("ClicktaleUID") + "." + localStorage.getItem("ClicktalePID"));
    utag_data.genesis_clicktale = p;
    b.genesis_clicktale = p;
}

// unset QSI_HistorySession cookie
// @TODO: delete this function or uncomment after its first run
// if (document.cookie.indexOf("QSI_HistorySession") >= 0) {
//   let expire = new Date();
//   expire.setTime(expire.getTime()-(10));
//   document.cookie = "QSI_HistorySession=; expires=" + expire.toGMTString();
// }

//Polling Callback
window.tealium_enrichment = function(data) {
    //console.log("Data Layer Enrichment Callback");
    //console.log(data);

     var audience_lst = [];
     for(k in data.audiences) {
        if(data.audiences[k].indexOf('_')>=0)
           audience_lst.push(data.audiences[k].split('_')[0]);
     }
    //console.log(audience_lst);
     if(audience_lst.length > 0)
        var aid = aid_prioritize(audience_lst);
        utag_data.audience_qualifier = aid;
        b.audience_qualifier = aid;
  };

//ION Pixel Conversion (Not sure if this is still needed???)
if(pmc != null && pmc.eVar1 == 'confirmation') {
	try {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = 'https://shaw.postclickmarketing.com/Outside/liveball.js';

		$("body").append(script);

	} catch(e) {

	}
	try {
	  liveballRecognize("shaw.postclickmarketing.com");
	  liveballConvert();
	}
	catch(e) {

	}
}

//ION Flow - Event Listener
jQuery(document.body).on("action", function(p) {
    if (p.type === "action" && p.event === "flowClick") {
        var el = document.createElement("a");
        var de = document.createAttribute("data-event");
        var dv = document.createAttribute("data-value");
        de.value = 'navigationAction';
        dv.value = p.value;
        el.setAttributeNode(de);
        el.setAttributeNode(dv);
        /*call global click track function with dummy element*/
        window.clickTrackEvent(el);
    }
});
