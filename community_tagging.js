function format_text(text = '') {
	return $.trim(text.replace(/[^a-zA-Z 0-9]+/g, '').replace(/\s+/g, "-"));
}

var section = format_text($("meta[property='article:section']").attr("content"));
var article = format_text($("meta[property='og:title']").attr("content"));

//Lithium Search
$(document).on('submit', '.SearchForm', function(e) {
	try {
		var formData = Object.assign($(event.target).serializeArray().reduce(function(a, x) {
							a[x.name] = x.value;
							return a;
						}, {}));
		var userSearchField = format_text(formData.userSearchField);
		if (window.utag_data.internal_search_term !== userSearchField) {
			Object.assign(window.utag_data, {
				internal_search_term: userSearchField,
				ai_search_keyword: userSearchField,
				navigationAction: 'search|' + userSearchField
			});
			utag.link(window.utag_data);
		}
	}
	catch(e) {}
});

//Lithium Search Autocomplete
$(document).on('mousedown click touchend', '.lia-autocomplete-node-item', function(e) {
	var item = format_text($(this).find('.lia-autocomplete-node-list-item-link').text());
	Object.assign(window.utag_data, {
        internal_search_term: item,
        ai_search_keyword: item,
        navigationAction: 'search-autocomplete|' + item
    });
	utag.link(window.utag_data);
});

//Lithium Search Results
$(document).on('click', '#searchResults a', function() {
	var item = format_text($(this).text());
	Object.assign(window.utag_data, {
	    navigationAction: 'search-results|' + item
	});
	utag.link(window.utag_data);
});


//Wysdom Search
$(document).on('wysdomSubmitSearch', function(event) {
    var searchTerm = format_text(event.detail.originalEvent.target[0].value);
    Object.assign(window.utag_data, {
        internal_search_term: searchTerm,
        ai_search_keyword: searchTerm,
        navigationAction: 'wysdom-search|' + searchTerm
    });
    utag.link(window.utag_data);
})

//Wysdom Autocomplete Click
$(document).on('wysdomAutocompleteClick', function(event) {
	var ac_text = $(event.detail.originalEvent.target).parent('.wysdom-search-autocomplete-list-item').text()
	if (!ac_text.length) {
		ac_text = $(event.detail.originalEvent.target).text();
    }
    Object.assign(window.utag_data, {
        navigationAction: 'wysdom-search-results|' + format_text(ac_text)
    });
    utag.link(window.utag_data);
});

//Wysdom Search Results
$(document).on('click', '.wysdom-search-result-content a', function() {
	var item = format_text($(this).text());
	Object.assign(window.utag_data, {
				navigationAction: 'wysdom-search-results|' + item
			});
	utag.link(window.utag_data);
});

//Article Content
$(document).on('click', '.lia-quilt-column-main-content a:not([data-event])', function(e) {
	if (typeof(section) !== 'undefined' && typeof(article) !== 'undefined' && section.length && article.length) {
		var item = format_text($(this).text());
		var article_term = $(this).parents('div.j-rte-table').length ? 'related-article' : 'article';
		if (item.length) {
		    Object.assign(window.utag_data, {
		        navigationAction: article_term + '|' + section + '|' + article + '|' + item
		    });
		    utag.link(window.utag_data);
		}
	}
});
//Discussion Panel
$(document).on('click', '.lia-quilt-forum-message a', function() {
	var article_term = ''
	if (typeof(section) !== 'undefined' && typeof(article) !== 'undefined' && section.length && article.length) {
		article_term = section + '|' + article + '|';
	}
	var item = format_text($(this).text());

	Object.assign(window.utag_data, {
	    navigationAction: 'community|' + article_term + item
	});
	utag.link(window.utag_data);
});

//Mobile Nav
$(document).on('click', 'a.lia-nav-action', function() {
	var item = format_text($(this).text());
	Object.assign(window.utag_data, {
	    navigationAction: 'mobile-nav|' + item
	});
	utag.link(window.utag_data);
});

//Breadcrumbs
$(document).on('click', '.crumb, .crumb a', function() {
	var item = format_text($(this).text());
	Object.assign(window.utag_data, {
	    navigationAction: 'breadcrumbs|' + item
	});
	utag.link(window.utag_data);
});


//Chat Events
lpTag.events.bind({
    eventName : "minimized",
    appName : "lpUnifiedWindow",
    func: function(e,d) {
    	Object.assign(window.utag_data, {
			navigationAction: 'chat-minimized'
		});
		utag.link(window.utag_data);
    },
});

lpTag.events.bind({
    eventName : "maximized",
    appName : "lpUnifiedWindow",
    func: function(e,d) {
    	Object.assign(window.utag_data, {
			navigationAction: 'chat-maximized'
		});
		utag.link(window.utag_data);
    }
});

lpTag.events.bind({
    eventName : "windowClosed",
    appName : "lpUnifiedWindow",
    func: function(e,d) {
    	Object.assign(window.utag_data, {
			navigationAction: 'chat-closed'
		});
		utag.link(window.utag_data);
    }
});

lpTag.events.bind({
    eventName : "state",
    appName : "lpUnifiedWindow",
    func: function(e, d) {
    	if (e.state === 'init') {
			Object.assign(window.utag_data, {
				navigationAction: 'chat-open'
			});
			utag.link(window.utag_data);
		}
		if (e.state === 'ended') {
			Object.assign(window.utag_data, {
				navigationAction: 'chat-ended'
			});
			utag.link(window.utag_data);
		}
    }
});