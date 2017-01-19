export default function prefixVisibilityChange() {
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
        this.set('hidden', 'hidden');
        this.set('visibilityChange', 'visibilitychange');
    } else if (typeof document.mozHidden !== "undefined") {
        this.set('hidden', 'mozHidden');
        this.set('visibilityChange', 'mozvisibilitychange');
    } else if (typeof document.msHidden !== "undefined") {
        this.set('hidden', 'msHidden');
        this.set('visibilityChange', 'msvisibilitychange');
    } else if (typeof document.webkitHidden !== "undefined") {
        this.set('hidden', 'webkitHidden');
        this.set('visibilityChange', 'webkitvisibilitychange');
    }
}
