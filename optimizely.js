try {
    if (typeof(optimizely) !== 'undefined') {
        var exp = [],
            name_lst = [],
            optly = optimizely.get('state').getCampaignStates({"isActive": true}),
            pid = optimizely.get('data').projectId,
            redirect = optimizely.get('state').getRedirectInfo();

        if (redirect === null) {
            Object.keys(optly).forEach(function (i,v) {
                exp.push(pid + '.' + optly[i].experiment.id + '.' + optly[i].variation.id);
                name_lst.push(optly[i].variation.name);
            });
        }
        else {
            exp.push(pid + '.' + redirect.experimentId + '.' + redirect.variationId);
        }

        var output = exp.join('|');
        utag_data.optimizely = output;
        b.optimizely = output;

        for (var i = 0;i<name_lst.length;i++) {
            if(name_lst[i].indexof('|')>0) {
                utag_data.audience_id = name_lst[i].split('|')[0];
                b.audience_id = name_lst[i].split('|')[0];
                utag.DB('Audience ID Set: ' + b.audience_id);
                break;
            }
        }
        utag.DB('Optimizely Experiment Set: ' + output);
    }
    else {
        utag.DB('Optimizely NOT READY - No data set');
    }
}
catch(e) {
  //Error!
}