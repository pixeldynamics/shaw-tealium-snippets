/* Prioritization Function */
window.aid_prioritize = function(qualified_audiences) {
    if(typeof utag_data != 'undefined' && typeof utag_data.audience_id !== 'undefined' && utag_data.audience_id !== '') {
        qualified_audiences.push(utag_data.audience_id);
    }
    else if(typeof b !== 'undefined' && typeof b.audience_id !== 'undefined' && b.audience_id !== '') {
        qualified_audiences.push(b.audience_id);
    }

    /*list*/
    var list = [
            {name: 'Existing Customer 2YVP Renewal', audience_id: '333352', priority: 1},
            {name: 'Existing Customer 2YVP Renewal', audience_id: '333351', priority: 2},
            {name: 'Existing Customer 2YVP Renewal', audience_id: '333350', priority: 3},
            {name: 'Existing Customer 2YVP Renewal 2P3P', audience_id: '333370', priority: 4},
            {name: 'Existing Customer 2YVP Renewal 2P3P', audience_id: '333369', priority: 5},
            {name: '333374_Amazon Upsell_1P MTM Customers', audience_id: '333374', priority: 6},
            {name: '333375_Amazon Upsell_1P 2YVP Customers', audience_id: '333375', priority: 7},
            {name: 'My Shaw Pod Upsell', audience_id: '333357', priority: 8},
            {name: 'Existing Customer BlueCurve TV Launch', audience_id: '333359', priority: 9},
            {name: 'Existing Customer BlueCurve TV Launch', audience_id: '333358', priority: 10},
            {name: '3P Internet TV Phone Customers', audience_id: '333336', priority: 11},
            {name: '2P Internet Phone Customers', audience_id: '333335', priority: 12},
            {name: '2P TV Phone Customers', audience_id: '333334', priority: 13},
            {name: '2P Internet TV Customers', audience_id: '333333', priority: 14},
            {name: '1P Phone Customers', audience_id: '333332', priority: 15},
            {name: '1P Internet Customers', audience_id: '333331', priority: 16},
            {name: '1P TV Customers', audience_id: '333330', priority: 17},
            {name: 'Winback Promotion',audience_id: '111151', priority: 18},
            {name: 'SK East',audience_id: '111147',priority: 19},
            {name: 'Small Markets',audience_id: '111118',priority: 20},
            {name: 'Price Conscious 2P3P - Tier 2',audience_id: '111124',priority: 21},
            {name: 'Price Conscious 1P - Tier 2',audience_id: '111148',priority: 22},
            {name: 'Bundlers - Tier 2',audience_id: '111145',priority: 23},
            {name: 'Internet Lovers - Tier 2',audience_id: '111130',priority: 24},
            {name: 'Price Conscious 2P3P - Tier 1',audience_id: '111123',priority: 25},
            {name: 'Price Conscious 1P - Tier 1',audience_id: '111144',priority: 26},
            {name: 'Bundlers - Tier 1',audience_id: '111143',priority: 27},
            {name: 'Internet Lovers - Tier 1',audience_id: '111129',priority: 28},
            {name: '2P/3P Look-a-like',audience_id: '111117',priority: 29},
            {name: '1P Internet Look-a-like',audience_id: '111119',priority: 30},
            {name: 'Lower Mainland Edmonton',audience_id: '111150',priority: 31},
            {name: 'Exclusion - Existing Customer Signals and Current Employees',audience_id: '111110',priority: 32},
            {name: 'Business_SmartSurveillance & SmartSecurity',audience_id: '222234',priority: 33},
            {name: 'Business_SmartWiFi Audience',audience_id: '222228',priority: 34},
            {name: 'Business_SmartVoice Audience',audience_id: '222229',priority: 35},
            {name: 'Business_SmartWiFI & SmartVoice Audience',audience_id: '222230',priority: 36},
            {name: 'Business_Internet Audience',audience_id: '222231',priority: 37},
            {name: 'Business_Phone Audience',audience_id: '222232',priority: 38},
            {name: 'Business_Internet &Phone Audience',audience_id: '222233',priority: 39},
            {name: 'Business_General Remarketing',audience_id: '222227',priority: 40},
        ],

        //qualified_audiences = ['111119', '111123', '111114', '2P/3P Look-a-like'], //Accepts Segment Name or Audience ID from origin.
        audience_match = list.filter(function (obj) {
            return (qualified_audiences.indexOf(obj.name) > -1 || qualified_audiences.indexOf(obj.audience_id) > -1);
        }),
        sorted_audience = audience_match.sort(function(a,b){ return a.priority - b.priority; });

        //Debugging
        /*console.log('You are in these audiences:');
        sorted_audience.forEach(function(obj) {
            console.log(obj.priority + ': ' + obj.name);
        });
        console.log('----------------------------');
        //sorted_audience[0] is the highest priority item of your current audience list.
        console.log('You should be in audience:', sorted_audience[0].audience_id);*/

        //utag_data.audience_qualifier = sorted_audience[0].audience_id;
        if(typeof sorted_audience != "undefined" && typeof sorted_audience[0] != "undefined" && typeof sorted_audience[0].audience_id != "undefined") {
            return sorted_audience[0].audience_id;
        }
        else { return "";}
    }

    //Get URL Parameters
    function get_url_param(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return decodeURIComponent(match[1].replace(/\+/g, ' '));
    }

    //Placeholder mock function for legacy GeoIP Service
    // @ TODO remove after migration
    function geoip() {
        return false;
    }

    //Set Optimizely ID for Adobe
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
    //Device Detection
    try {
        window.deviceDetector = (function () {
            var ua = navigator.userAgent.toLowerCase();
            var detect = (function(s) {
                if(s === undefined) { s = ua; }
                else { ua = s.toLowerCase(); }

                if(/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua)) {
                    return 'tablet';
                }

                else {
                    if(/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/.test(ua)) {
                        return 'phone';
                    }
                    else {
                        return 'desktop';
                    }
                }
            });
            return {
                device:detect(),
                detect:detect,
                isMobile:((detect()!='desktop')?true:false),
                userAgent:ua
            };
        }());
    }
    catch (e) {
        /* Unable to detect device */
    }

    /*
    Wait Until Exists
    https://community.tealiumiq.com/t5/iQ-Tag-Management/Using-jQuery-waitUntilExists-to-modify-page-elements-that-aren-t/ta-p/5612
    */
    (function(e, f) {
        var b = {},
        g = function(a) { b[a] && (f.clearInterval(b[a]), b[a] = null) };
        e.fn.waitUntilExists = function(a, h, j) {
            var c = this.selector,
            d = e(c),
            k = d.not(function() {
            return e(this).data("waitUntilExists.found")
                });
            "remove" === a ? g(c) : (k.each(a).data("waitUntilExists.found", !0), h && d.length ? g(c) : j || (b[c] = f.setInterval(function() { d.waitUntilExists(a, h, !0) }, 500)));
            return d
        }
    })(jQuery, window);

    //Legacy Click Tracking @TODO: Remove ?
    window.clickTrackEvent = function(el) {
        console.log("clickTrackEvent function");
        var $this = $(el),
            textOfClick = "";
        if ($this.attr("data-value") && typeof $this.attr("data-value") != undefined) {
            if ($this.attr("data-value").length > 0) {
                textOfClick = $this.attr("data-value");
            } else {
                textOfClick = "linkClick";
            }
        } else {
            textOfClick = pmc.cleanUpVar($this[0].innerText);
        }
        if ($this.closest("a.accordion-toggle").length) {
            var valueOfTab = String($this.closest("a.accordion-toggle").attr("aria-expanded"));
            var showHide = valueOfTab == "true" ? "show" : "hide";
            if ($("a.accordion-toggle label span").length) {
                var isOpen = $this.closest(".panel").find(".panel-collapse").css("height");
                showHide = (isOpen != "0px")?"hide":"show";
            }
            textOfClick = textOfClick + "|tab|" + showHide;
        }
        textOfClick = textOfClick.replace(/[^\w,\|]+/gi, "-").replace(/\b_|_\b/gi, "").toLowerCase();
        var trackObj = {
            navigation_click: "true",
            navigationAction: textOfClick,
            link_name: "navigation click",
            user_agent_string: utag_data["user_agent_string"],
            site_name: utag_data["site_name"],
            site_version: utag_data["site_version"],
            hour_of_day: utag_data["hour_of_day"],
            day_of_month: utag_data["day_of_month"],
            user_type: utag_data['user_type'],
            page_name: utag_data['page_name'],
            page_section: utag_data['page_section'],
            home_postal_code: utag_data['home_postal_code'],
            url: utag_data["dom.url"],
        }
        trackObj["form_name"] = utag_data["form_name"];
        trackObj["form_step"] = utag_data["form_step"];
        trackObj["timestamp"] = utag_data["timestamp"];
        trackObj["lead_form_name"] = utag_data["lead_form_name"] || "";
        trackObj["referring_url"] = utag_data["referring_url"];
        trackObj["timestamp"] = utag_data["timestamp"];
        trackObj["site_language"] = utag_data["site_language"];
        trackObj["platform"] = utag_data["platform"];
        trackObj["page_section_l2"] = utag_data["page_section_l2"];
        trackObj["page_section_l3"] = utag_data["page_section_l3"];
        trackObj["page_section_l4"] = utag_data["page_section_l4"];
        trackObj["page_section_l5"] = utag_data["page_section_l5"];
        trackObj["taxonomy_level"] = utag_data["taxonomy_level"];
        trackObj["user_login_state"] = utag_data["user_login_state"];
        trackObj["new_repeat"] = utag_data["new_repeat"] = s.getNewRepeat(60);
        var tObjStr = $this.attr("data-trackobj") || "{}";
        var tObj = JSON.parse(tObjStr);
        var tObjEvents = "";
        for (var x in tObj) {
            if (x !== "events") {
                trackObj[x] = tObj[x];
                utag_data[x] = tObj[x];
            } else {
                tObjEvents += tObj[x] + " ";
            }
        }
        var eventName = ($this.attr("data-event") + " " + tObjEvents).trim();
        var enArr = eventName.split(" ");
        for (var n = 0; n < enArr.length; n++) {
            var newName = enArr[n];
            if (newName.includes("Action")) {
                trackObj[newName] = textOfClick;
                trackObj["event_name:" + newName] = newName;
                if (newName.includes("quizAction")) {
                    trackObj["quizAction"] = utag_data['quizAction'];
                    delete utag_data['quizAction'];
                }
                if (newName.includes("chatAction")) {
                    trackObj["chat_id"] = $('body').attr('data-clickId') || textOfClick;
                    utag_data['chat_id'] = $('body').attr('data-clickId') || textOfClick;
                }
                if (newName.includes("optlyAction")) {
                    trackObj["audience_id_v107"] = utag_data['audience_id']||b['audience_id'];
                    utag_data["audience_id_v107"] = utag_data['audience_id']||b['audience_id'];
                }
            }
        }
        trackObj["event_name:linkEvent"] = "trigger";
        console.log("link track - send data");
        utag.link(trackObj);
    }

    //
    // Order Data Utilities
    //
    function order_total() {
        var total = 0, sale_price = utag_data.product_sale_price || [];
        sale_price.forEach(function(value) { total += Number(value); });
        return total;
    }

    function order_id() {
        return utag_data.order_id || false;
    }

    function order_currency() {
        return utag_data.order_currency || 'CAD';
    }

    function rgu_count() {
        var total = 0, rgus = utag_data.product_rgu || [];
        rgus.forEach(function(value) { total += !isNaN(value) ? Number(value) : 0 });
        return total;
    }

    function product_names() {
        var product_names = utag_data.product_name || [];
        return product_names.join(',') || false;
    }

    function product_order_types() {
        var order_type = utag_data.product_order_type || [];
        return order_type.join(',') || false;
    }

    function lead_form_name() {
        return utag_data.lead_form_name || false;
    }

    function lead_form_name_clean() {
        return utag_data.lead_form_name.replace(/[^a-zA-Z 0-9]+/g, '.') || false;
    }

    function eoid() {
        return utag_data['qp.eoId'] || false;
    }

    function is_thanks() {
      // to accomodate creditcheck
      if(utag_data.form_name === 'ecomm-creditcheck'){
         return false;
      }
      if (order_id() !== false || (/thankyou/i).test(utag_data.form_step)){
        return true;
      }
      else{
        return false;
      }
    }

    // url toggle
    if(window.location.href.indexOf('tshaw=off') > -1 || location.search.indexOf('tshaw=off') > -1){
      // window.utag_cfg_ovrd = window.utag_cfg_ovrd || {};
      window.utag_cfg_ovrd.dom_complete = true;
      window.utag_cfg_ovrd.noload = true;
    }
