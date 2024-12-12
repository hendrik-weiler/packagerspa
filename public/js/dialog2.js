app().events.on('prepare_template', function(e) {
    if(e.route.path !== '/dialog') return;
    console.log('prepare dialog', e);
});

app().events.on('prepare_template', function(e) {
    if(e.route.path !== '/test') return;
    console.log('prepare test', e);
    let x =document.createElement('div');
    x.innerHTML = 'test';
    e.route._node.appendChild(x);
});


app().events.on('display_template', function(e) {
    if(e.route.path !== '/dialog') return;
    console.log('display dialog', e);
});