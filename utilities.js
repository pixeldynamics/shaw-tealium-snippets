/*
Get URL Parameter
*/
function get_url_param(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  /*
  GEOIP
  */
  function geoip() {
      var obj = {};
      var geoip = JSON.parse(localStorage.getItem('geoip')) || false;
      if (geoip) { obj = geoip; }
      else {
          $.ajax({
              url: 'https://www.shaw.ca/store/data/requestHeaderData.jsp',
              dataType: 'json',
              type: 'get',
              async: false,
              success: function (json) {
                  obj = json.data.reduce(function(result, item) {
                      var key = Object.keys(item)[0];
                      result[key] = item[key];
                      return result;
                    }, {});
                    localStorage.setItem('geoip', JSON.stringify(obj));
              }
          });
      }
      if (arguments.length > 0 && arguments[0].length > -1 && obj.hasOwnProperty(arguments[0])) {
          return obj[arguments[0]];
      }
      else if (Object.keys(obj).length > 0) {
          return obj;
      }
      return false;
  }

  /* Prioritization Function */
  window.aid_prioritize = function(qualified_audiences) {
    if(typeof utag_data != "undefined" && typeof utag_data.audience_id != "undefined" && utag_data.audience_id != "") {
      qualified_audiences.push(utag_data.audience_id);
    }
    else if(typeof b != "undefined" && typeof b.audience_id != "undefined" && b.audience_id != "") {
      qualified_audiences.push(b.audience_id);
    }
/*list*/
    var list = [
      {name: 'Student - Existing', audience_id: '333368', priority: 1},
      {name: 'Existing Customer 2YVP Renewal', audience_id: '333354', priority: 2},
      {name: 'Existing Customer 2YVP Renewal', audience_id: '333353', priority: 3},
      {name: 'Existing Customer 2YVP Renewal', audience_id: '333352', priority: 4},
      {name: 'Existing Customer 2YVP Renewal', audience_id: '333351', priority: 5},
      {name: 'Existing Customer 2YVP Renewal', audience_id: '333350', priority: 6},
      {name: 'Existing Customer 2YVP Renewal 2P3P', audience_id: '333369', priority: 7},
      {name: 'Existing Customer 1PTV Cross-sell', audience_id: '333371', priority: 8},
      {name: 'My Shaw Pod Upsell', audience_id: '333357', priority: 9},
      {name: 'Internet Upsell', audience_id: '333337', priority: 10},
      {name: '3P Internet TV Phone Customers', audience_id: '333336', priority: 11},
      {name: '2P Internet Phone Customers', audience_id: '333335', priority: 12},
      {name: '2P TV Phone Customers', audience_id: '333334', priority: 13},
      {name: '2P Internet TV Customers', audience_id: '333333', priority: 14},
      {name: '1P Phone Customers', audience_id: '333332', priority: 15},
      {name: '1P Internet Customers', audience_id: '333331', priority: 16},
      {name: '1P TV Customers', audience_id: '333330', priority: 17},
      {name: 'SK East',audience_id: '111147',priority: 18},
      {name: 'Student - New',audience_id: '111146',priority: 19},
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
      {name: 'Exclusion - Existing Customer Signals and Current Employees',audience_id: '111110',priority: 32}
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