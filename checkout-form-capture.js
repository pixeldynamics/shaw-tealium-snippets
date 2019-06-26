if (document.location.pathname.includes('/checkout')) {
	$(document).on('submit', function(event) {
		if (typeof(sha256 === 'function')) {
			try {
				localStorage.setItem('checkoutForm', JSON.stringify(Object.assign(
                    $(event.target).serializeArray().reduce(function(a, x) {
                        if (x.name === 'phoneNumber') {
                            x.value = x.value.replace(/\D/g,'')
                        }
                        a['checkoutForm_' + x.name] = sha256(x.value); return a;
                    }, {}),
                    JSON.parse(localStorage.getItem('checkoutForm')))));
			}
			catch(e){}
		}
	});
}
if (document.location.pathname.includes('/order-confirmation')) {
    try {
        Object.assign(b, JSON.parse(localStorage.getItem('checkoutForm')));
	    localStorage.removeItem('checkoutForm');
    }
    catch(e) {}
}