app().events.on('prepare_template', function(e) {
    if(e.route.path !== '/dialog') return;
    console.log('prepare dialog', e);
});


app().events.on('display_template', function(e) {
    if(e.route.path !== '/dialog') return;
    console.log('display dialog', e);
});