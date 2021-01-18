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

// @ TODO there seems to be work still going on regarding config for this,
// is this code currently needed or can it be commented out? -Obi
//Clicktale Mapping
if (document.cookie.indexOf("WRUID") > -1 && document.cookie.indexOf("_CT_RS_") > -1 && window.localStorage && localStorage.getItem("ClicktalePID") && localStorage.getItem("ClicktaleUID")) {
    var p = (localStorage.getItem("ClicktaleUID") + "." + localStorage.getItem("ClicktalePID"));
    utag_data.genesis_clicktale = p;
    b.genesis_clicktale = p;
}

//Polling Callback

document.addEventListener("tealiumDLE", function(event) {
    var data = event.detail;

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
});

