// @ TODO is this code needed? hotfix  -Obi

try {
    var user_type = analytics.tools.get_storage('new_customer_type');
    if (user_type == null && (document.cookie.indexOf('browser_profile=') > -1)) {
      var user_cookie = analytics.tools.get_cookie('browser_profile').split("!"), profile = [];
      user_cookie.forEach(function(e){
        profile.push(e.replace(/^\{|\}$/g,""));
      });
      var user_type = profile[0] || 'unknown';
    }
    if (user_type == null || user_type.length <= 0) {
      user_type = 'unknown';
    }
    analytics.settings.user_type = user_type;
    b.user_type = user_type;
  }
  catch(e) {
      //There was a problem.
  }
