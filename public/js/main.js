$(function() {
    $('input').on('keydown', function(e) {
        if (e.which == 13) {
            console.log($('#exampleInputEmail1').val())
            console.log($('#exampleInputPassword1').val())
        }
    })
    $('.login-button').on('click', function() {
        console.log($('#exampleInputEmail1').val())
        console.log($('#exampleInputPassword1').val())
    });
});