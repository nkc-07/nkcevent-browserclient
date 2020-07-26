$('.input-day').change(function(e) {
    let date = ($(this).val()).split('-');

    $('.held-month').text(date[1]);
    $('.held-day').text(date[2]);
});

let toDay = new Date();
$('.create-day').text(
    toDay.getFullYear() + '/' +
    toDay.getMonth() + '/' +
    toDay.getDate()
);

$('.send-event-img').on('change', function(e) {
    var reader = new FileReader();
    reader.onload = function(e) {
        $(".event-img").attr('src', e.target.result);
    }
    reader.readAsDataURL(e.target.files[0]);
});