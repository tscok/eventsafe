export function apostrophe(name) {
    // if (name.match(/[']/g)) {
    //     return name;
    // }
    let lastChar = name.charAt(name.length - 1);
    return lastChar === 's' ? name + '\'' : name + '\'s';
}
