app().events.on('prepare', function(e) {
    if(e.route.path !== '/') return;
    console.log('prepare index', e);
});


app().events.on('display', function(e) {
    if(e.route.path !== '/') return;
    console.log('display index', e);
});

function auth() {
    console.log("auth");
}