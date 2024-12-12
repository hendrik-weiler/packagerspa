app().events.on('prepare_template', function(e) {
    if(e.route.path !== '/nested') return;
    console.log('prepare nested', e.route.path);
});


app().events.on('display_template', function(e) {
    if(e.route.path !== '/nested') return;
    console.log('display nested', e);
});