app().events.on('prepare', function(e) {
    console.log('prepare about', e);
});


app().events.on('display', function(e) {
    console.log('display about', e);
});