$('.drawer').drawer({
    class: {
        nav: 'drawer-nav',
            toggle: 'drawer-toggle',
            overlay: 'drawer-overlay',
            open: 'drawer-open',
            close: 'drawer-close',
            dropdown: 'drawer-dropdown'
    },
    iscroll: {
        mouseWheel: true,
        preventDefault: false
    },
    showOverlay: true
});

if (localStorage.getItem('token') !== null) {
    $('.drawer-menu .login').show();
    $('.drawer-menu .no-login').hide();

}