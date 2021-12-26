} catch(e) {
    window.parent.postMessage({
        message: e && e.message || e,
        colno: null,
        lineno: null
    });
}
