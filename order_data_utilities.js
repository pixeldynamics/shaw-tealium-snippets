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
  if (utag_data.form_name === 'ecomm-creditcheck' || order_id() !== false || (/thankyou/i).test(utag_data.form_step))
  {
    return true;
  }
  else{
    return false;
  }
}
