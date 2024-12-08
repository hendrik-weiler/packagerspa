app().events.on('prepare_template', function(e) {
    if(e.route.path !== '/') return;
    if(e.mode === 'layout') return;
    console.log('prepare index', e);

    document.forms.registerForm.onsubmit = function(e) {
        e.preventDefault();
        var data = {
            email: document.forms.registerForm.email.value,
            password: document.forms.registerForm.password.value
        };
        location.hash = '#/home';
    }
});


app().events.on('display_template', function(e) {
    if(e.route.path !== '/') return;
    console.log('display index', e);
});