/**@license
 *   ___ ___ _____  __      __   _      _____              _           _
 *  / __|_ _|_   _| \ \    / /__| |__  |_   _|__ _ _ _ __ (_)_ _  __ _| |
 * | (_ || |  | |    \ \/\/ / -_) '_ \   | |/ -_) '_| '  \| | ' \/ _` | |
 *  \___|___| |_|     \_/\_/\___|_.__/   |_|\___|_| |_|_|_|_|_||_\__,_|_|
 *
 * this is service worker and it's part of GIT Web terminal
 *
 * Copyright (c) 2018 Jakub Jankiewicz <http://jcubic.pl/me>
 * Released under the MIT license
 *
 */
self.importScripts('https://cdn.jsdelivr.net/npm/idb-keyval/dist/umd.js');

const mime = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript'
};

self.addEventListener('fetch', function (event) {
    var url = event.request.url;
    if (url.match(/__idb__/)) {
        event.respondWith(getStatic(url));
        return;
    }
    if (event.request.cache === 'only-if-cached' &&
        event.request.mode !== 'same-origin') {
        return;
    }
    event.respondWith(fetch(event.request).catch(() => {}));
});

function getMime(type) {
    const result = mime[type];
    if (result) {
        return result;
    }
    return 'text/plain';
}

function getStatic(url) {
    return new Promise(function(resolve, reject) {
        var m = url.match(/__idb__\/([^?]+)(?:\?.*$)?/);
        function redirect_dir() {
            return resolve(Response.redirect(url + '/', 301));
        }
        let key;
        if (m) {
            key = m[1];
            if (key === '') {
                return redirect_dir();
            }
            m = key.match(/\.([^.]+)$/);
            const extension = m && m[1];
            const mime = getMime(extension);
            //console.log(`Serving ${key} from indexedDB using idb-keyval as ${mime}`);
            idbKeyval.get(key).then(value => {
                if (!value) {
                    return resolve(error404(key));
                }
                resolve(textResponse(value, { type: getMime(extension) }));
            }).catch(error => {
                resolve(error500(error));
            });
        }
    });

}

function textResponse(string, { init, type = 'text/html' } = {}) {
    var blob = new Blob([string], {
        type
    });
    return new Response(blob, init);
}

function error500(error) {
    var output = [
        '<!DOCTYPE html>',
        '<html>',
        '<body>',
        '<h1>500 Server Error</h1>',
        '<p>Service worker give 500 error</p>',
        `<p>${error.message || error}</p>`,
        '</body>',
        '</html>'
    ];
    return textResponse(output.join('\n'), {
        init: {
            status: 500,
            statusText: '500 Server Error'
        }
    });
}

function error404(path) {
    var output = [
        '<!DOCTYPE html>',
        '<html>',
        '<body>',
        '<h1>404 File Not Found</h1>',
        `<p>File ${path} not found in indexedDB`,
        '</body>',
        '</html>'
    ];
    return textResponse(output.join('\n'), {
        init: {
            status: 404,
            statusText: '404 Page Not Found'
        }
    });
}
