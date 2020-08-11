$(function() {
    let modalDom = $('#modal').clone();
    $('#modal')[0].remove();

    $('#tag-button').click(function() {
        Swal.fire({
            title: 'タグの追加',
            html: modalDom.show()
        });

        $('#modal .tag-text').on('keydown', function(e) {
            if (e.which == 13) {
                addTag();
            } else {
                $.ajax({
                        type: "GET",
                        url: "/api/other/tag.php",
                        data: "str=" + $(this).val() + e.key,
                        dataType: "json"
                    })
                    .done(function(response) {
                        // ajax用の設定もあるが、matchedイベントを発火できないので別で取得
                        $('.add-tag .tag-text').MySuggest({
                            msArrayList: response['autocompleteInfo']
                        });

                        $('#modal .tag-text').on('selected matched', function() {
                            let targetTagInfo = response['tagInfo'].find(({ tag_name }) => tag_name == $(this).val());
                            console.log(targetTagInfo)
                        });
                    });
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