const nombreCache = 'apv-v1'; 
const assets = [
    '/',
    '/index.html',
    '/error.html',
    '/css/bootstrap.css',
    '/css/styles.css',
    '/js/app.js',
    '/js/apv.js'
];


//* INSTALAR EL SERVICE WORKER
//* instalar y activando el service worker
//! como en los service worker no se permite window se usa la plabra self
self.addEventListener('install', e => {
    console.log('Instalado el Service Worker');

    e.waitUntil(

        // Buen lugar para cachear - 
        caches.open(nombreCache)
            .then( cache => { // Esta función es asincrona...
                console.log('cacheando...');
                cache.addAll(assets);
            })
    );

    // Revisar en App (Chrome) en Firefox en Almacenamiento

});

// Activar el service worker...
self.addEventListener('activate', e => {
    console.log('Service Worker Activado');

    // Actualizar la PWA //
    e.waitUntil(
        caches.keys()
            .then(keys => {
                console.log(keys); 

                return Promise.all(keys
                        .filter(key => key !== nombreCache)
                        .map(key => caches.delete(key)) // borrar los demas
                    )
            })
    )
});

// Fetch events para el CSS, HTML, imagenes JS, y hasta llamados a fetch..
self.addEventListener('fetch', e => {
    console.log('Fetch.. ', e);

    e.respondWith(
        caches.match(e.request)
            .then(respuestaCache => {
                return respuestaCache || fetch(e.request);
            })
            .catch( () => caches.match('/error.html'))
    );
});

// Al tener este fetch, un nombre de app, y una página de inicio, ya podremos agregar nuestra PWA a la página de inicio...


// clICK EN LOS 3 PUNTOS

//  More Tools -> Remote Devices y escribir.

// http://127.0.0.1:5500/index.html

// Presionar Open.
