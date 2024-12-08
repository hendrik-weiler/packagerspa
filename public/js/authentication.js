function auth(route, next) {
    if(route.private) {
        location.hash = '#/';
        return;
    }
    next();
}