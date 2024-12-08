app().events.on('prepare_template', function(e) {
    if(e.route.path !== '/about') return;
    console.log('prepare about', e);
});


app().events.on('display_template', function(e) {
    if(e.route.path !== '/about') return;
    console.log('display about', e);
});