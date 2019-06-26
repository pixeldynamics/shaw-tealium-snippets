locArr = [];
if (utag.data['cp.location'] && utag.data['cp.location'].length > 0) {
	utag.data['cp.location'].split("!").forEach(function(e){
	    locArr.push(e.replace(/^\{|\}$/g,""));
	});
        utag_data.isp_org = locArr[13];
	b['isp_org'] = locArr[13];
	b['is_shaw_ip'] = (locArr[13].indexOf("shaw") > -1) ? "true" : "false";
}