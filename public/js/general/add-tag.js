let searchTagInfo = undefined;
let targetTagInfo = undefined;
let sendTagList = Array();
let tagCardDom = $('.tag-card');

$(function() {
    $.ajax({
            type: "GET",
            url: "/api/other/tag.php",
            dataType: "json"
        })
        .done(function(response) {
            searchTagInfo = response;
        });

    let modalDom = $('#modal').clone();
    $('#modal')[0].remove();

    $('#tag-button').click(function() {
        Swal.fire({
            title: 'タグの追加',
            html: modalDom.show()
        }).then(function(result) {
            sendTagList.forEach(element => {
                let tagCardDOmClone = tagCardDom.clone().show();
                tagCardDOmClone.find('span').text(element['tag_name']);
                $('.tag-box .clear-float').append(tagCardDOmClone);
            });
        });

        // ajax用の設定もあるが、matchedイベントを発火できないので別で取得
        $('.add-tag .tag-text').MySuggest({
            msArrayList: searchTagInfo['autocompleteInfo'],
            msRegExpAll: true
        });

        $('#modal .tag-text').off('selected matched');
        $('#modal .tag-text').on('selected matched', function() {
            targetTagInfo = searchTagInfo['tagInfo'].find(({ tag_name }) => tag_name == $(this).val());
            console.log(targetTagInfo)
        });

        $('#modal .tag-text').on('keyup', function(e) {
            if (e.which == 13) {
                addTag();
            }
        });

        $('#modal .add-tag-button').click(function() {
            addTag();
        });
    });
});

function addTag() {
    if (targetTagInfo !== undefined) {
        let tagCardDOmClone = tagCardDom.clone().show();
        tagCardDOmClone.find('span').text(targetTagInfo['tag_name']);
        $('#modal .tag-box .clear-float').append(tagCardDOmClone);

        sendTagList.push(targetTagInfo);
        console.log(sendTagList);

        targetTagInfo = undefined;
    }
}

function sendTag(eventId) {
    sendTagList.forEach(e => {
        $.ajax({
            type: "POST",
            url: "/api/event/eventtag.php",
            dataType: "json",
            data: {
                event_id: eventId,
                event_tag: e['tag_id']
            }
        }).done(function() {
            console.log('success');
        });
    });
}