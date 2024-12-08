app().events.on('prepare', function(e) {
    console.log('prepare', e);
});


app().events.on('display', function(e) {
    console.log('display', e);
});

function auth() {
    console.log("auth");
}