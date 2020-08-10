$(function() {
    let modalDom = $('#modal').clone();
    $('#modal')[0].remove();

    $('#tag-button').click(function() {
        Swal.fire({
            title: 'タグの追加',
            html: modalDom.show()
        });

        $('#modal input').on('keydown', function(e) {
            if (e.which == 13) {
                addTag();
            }
        });
        $('#modal .add-tag-button').click(function() {
            addTag();
        });
    })
});

function addTag() {
    console.log('push button');
    //todo..
}