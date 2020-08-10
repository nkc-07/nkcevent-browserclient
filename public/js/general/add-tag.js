$(function() {
    // $.ajax({
    //     url: '/api/other/tag.php', //送信先
    //     type: 'GET', //送信方法
    //     datatype: 'json' //受け取りデータの種類
    // }).done(function(response) {
    //     let tagInfo = new Array();
    //     response['data'].forEach(e => tagInfo.push(e['tag_name']));


    // }).fail(function(response) {
    //     console.log('通信失敗');
    //     console.log(response);
    // });

    let modalDom = $('#modal').clone();
    $('#modal')[0].remove();

    $('#tag-button').click(function() {
        Swal.fire({
            title: 'タグの追加',
            html: modalDom.show()
        });

        $('.add-tag .tag-text').MySuggest({
            msAjaxUrl: '/api/other/tag.php'
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