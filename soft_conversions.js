if (a === 'view' && b.page_name === 'checkout') {
    var send_to = false;
    switch(b.form_step) {
        case 'contact info':
            send_to = 'check0+unique';
        break;
        case 'service address':
            send_to = 'check00+unique';
        break;
        case 'installation':
            send_to = 'check000+unique';
        break;
        case 'billing info':
            send_to = 'check001+unique';
        break;
    }
    if (typeof(gtag) !== 'undefined' && send_to) {
       gtag('event', 'conversion', {
        'allow_custom_scripts': true,
        'u3': b.form_step,
        'send_to': 'DC-8263629/leads/' + send_to
      });
    }
}