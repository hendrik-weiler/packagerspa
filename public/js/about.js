app().events.on('prepare', function(e) {
    if(e.route.path !== '/about') return;
    console.log('prepare about', e);
});


app().events.on('display', function(e) {
    if(e.route.path !== '/about') return;
    console.log('display about', e);
});