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


// @ TODO is this code needed after the decommission? -Obi
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


// Tealium Tracking Code for YouTube iframe embeds
if (jQuery('iframe[src*="youtube.com"]').length > 0) {
 let i = 0, id;
 window.iframe_id = [];
 jQuery('iframe[src*="youtube.com"]').each(function() {
   if (jQuery(this).attr('id')) {
     id = jQuery(this).attr('id');
     window.iframe_id.push(id);
   } else {
     id = 'tealium_youtube' + i;
     jQuery(this).attr('id', id);
     window.iframe_id.push(id);
     i++;
   }
 });
}

function setMileStones(i) {
  mileStones[i] = [25, 50, 75, 95, 100];
}
let mileStones = [];
if (window.iframe_id) {
  for (i = 0; i < window.iframe_id.length; i++) {
    setMileStones(i);
  }
}

// Load the YouTube iframe library
let ytapi = document.createElement('script');
ytapi.src="https://www.youtube.com/iframe_api";
let scriptref = document.getElementsByTagName('script')[0];
scriptref.parentNode.insertBefore(ytapi, scriptref);

window.players = [];
window.onYouTubeIframeAPIReady = function() {
  // Confirm existing ID or set ID in the iframe for each video on the page
  jQuery('iframe[src*="youtube.com"]').each(function() {
  let id = jQuery(this).attr('id');
  window.players[id] = new YT.Player(id, {
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
      }
    });
  });
};

window.start = [];
window.onPlayerReady = function(event) {
 //Log that the video is ready/open
 let idx;
 for (i = 0; i < window.iframe_id.length; i++) {
   if (window.iframe_id[i] === event.target.a.id) {
     idx = i;
   }
   window.start.push(true);
 }
 if (event.target.getPlayerState() === YT.PlayerState.CUED) {
   let player = event.target;
   let player_data = player.getVideoData() ;
   utag.link(
   { tealium_event: 'video_load',
     video_id: player_data.video_id,
     video_length: Math.round(player.getDuration()).toString(),
     video_name: player_data.title,
     video_platform: 'YouTube'
   });
  }
};

let playerCheckInterval, event;

window.onPlayerStateChange = function(event) {
 player = event.target;
 let playhead, idx;
 for (i = 0; i < window.iframe_id.length; i++) {
   if (window.iframe_id[i] === event.target.a.id) {
     idx = i;
   }
 }

 let shaw_t_event_ = "";
 let perComplete = ((player.getCurrentTime() / player.getDuration()) * 100).toString;
 if (event.data == YT.PlayerState.PLAYING) {
   if (start[idx]) {
     if (mileStones[idx].length > 0) {
       playerCheckInterval = setInterval(mileStoneCheck, 50);
     }
     shaw_t_event_ = "video_start";
     playhead = 0;
   } else {
     //This will catch when the video playback is changed from not playing to playing
     shaw_t_event_ = "video_play";
     playhead = player.getCurrentTime().toString();
   }
   start[idx] = false;

 } else if (event.data == YT.PlayerState.PAUSED) {
   shaw_t_event_ = "video_pause";
   playhead = player.getCurrentTime().toString();

 } else if (event.data == YT.PlayerState.ENDED) {
   if (mileStones[idx].length > 0) {
     clearInterval(playerCheckInterval);
     // reset in case visitor replays the video
     playerCheckInterval = 0;
     setMileStones(idx);
   }
   shaw_t_event_ = "video_complete"; // utag
   playhead = Math.round(player.getDuration()).toString();
 } else if (perComplete == '95') {
   shaw_t_event_ = "video_complete"; // utag
   playhead = Math.round(player.getDuration()).toString();
   if (mileStones[idx].length > 0) {
     clearInterval(playerCheckInterval);
     // reset in case visitor replays the video
     playerCheckInterval = 0;
     setMileStones(idx);
   }
 }

 if (shaw_t_event_) {
   utag.DB("Video event: " + shaw_t_event_ + ", video ID: " + window.iframe_id[idx]);
   let player_data = player.getVideoData() ;
   utag.link(
   { tealium_event: shaw_t_event_,
     video_playhead: parseInt(playhead).toString(),
     video_id: player_data.video_id,
     video_length: Math.round(player.getDuration()).toString(),
     video_name: player_data.title,
     perComplete: perComplete,
     video_platform: 'YouTube'
   });
 }

  function mileStoneCheck() {
    let idx;
    for (i = 0; i < window.iframe_id.length; i++) {
      if (window.iframe_id[i] === player.a.id) {
        idx = i;
      }
    }
    let duration = Math.round(player.getDuration());
    let playhead = parseInt(player.getCurrentTime());
    let percComplete = (playhead / duration) * 100;
    let ms_len = mileStones[idx].length;
    if (ms_len > 0) {
      let next_ms = mileStones[idx][0];
      if (next_ms <= percComplete) {
        mileStones[idx].shift();
        utag.DB("Video event: video_milestone, video ID: " + window.iframe_id[idx] + ", Milestone=" + percComplete.toFixed());
        localStorage.setItem('check_video_milestone', "Video event: video_milestone, video ID: " + window.iframe_id[idx] + ", Milestone=" + percComplete.toFixed());
        let player_data = player.getVideoData() ;
        utag.link(
        { tealium_event: 'video_milestone',
          video_playhead: parseInt(playhead).toString(),
          video_id: player_data.video_id,
          video_length: duration.toString(),
          video_milestone: next_ms.toString(),
          video_name: player_data.title,
          perComplete: perComplete,
          video_platform: 'YouTube'
        });
      }
    }
  }
};
