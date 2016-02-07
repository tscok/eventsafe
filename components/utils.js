export function apostrophe(name) {
    if (/[']/g.test(name)) {
        return name;
    }
    let lastChar = name.charAt(name.length - 1);
    return lastChar === 's' ? name + '\'' : name + '\'s';
}

export function extend(base) {
    var parts = Array.prototype.slice.call(arguments, 1);
    parts.forEach(function (p) {
        if (p && typeof (p) === 'object') {
            for (var k in p) {
                if (p.hasOwnProperty(k)) {
                    base[k] = p[k];
                }
            }
        }
    });
    return base;
}
