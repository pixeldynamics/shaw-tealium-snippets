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