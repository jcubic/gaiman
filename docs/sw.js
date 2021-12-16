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

self.addEventListener('install', function(evt) {
    self.skipWaiting();
    self.importScripts('https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm');
});

self.addEventListener('fetch', function (event) {
    event.respondWith(new Promise(function(resolve, reject) {
        function sendFile(path) {
            fs.readFile(path, function(err, buffer) {
                if (err) {
                    err.fn = 'readFile(' + path + ')';
                    return reject(err);
                }
                resolve(new Response(buffer));
            });
        }
        var url = event.request.url;
        var m = url.match(/__idb__(.*)/);
        function redirect_dir() {
            return resolve(Response.redirect(url + '/', 301));
        }
        if (m && self.fs) {
            var key = m[1];
            if (key === '') {
                return redirect_dir();
            }
            console.log('serving ' + key + ' from indexedDB using idb-keyval');
            var value = get(key);
            if (!value) {
                return resolve(textResponse(error404(path)));
            }
            resolve(new Response(buffer));
        } else {
            if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
                return;
            }
            //request = credentials: 'include'
            fetch(event.request).then(resolve).catch(reject);
        }
    }));
});
function textResponse(string) {
    var blob = new Blob([string], {
        type: 'text/html'
    });
    return new Response(blob);
}

function error404(path) {
    var output = [
        '<!DOCTYPE html>',
        '<html>',
        '<body>',
        '<h1>404 File Not Found</h1>',
        `<p>File ${path} not found in browserfs`,
        '</body>',
        '</html>'
    ];
    return output.join('\n');
}
