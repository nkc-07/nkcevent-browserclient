$('.form-control').change(function(e) {
    let date = ($(this).val()).split('-');

    $('.held-month').text(date[1]);
    $('.held-day').text(date[2]);
});