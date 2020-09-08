function searchUrlGenerater(url) {
    let getRequestParams = (new URL(document.location)).searchParams;

    $('[type=serch]').val(getRequestParams.get('event_name'));
    let sendURL = url +
        (
            getRequestParams.get('event_name') !== null ?
            'event_name=' + getRequestParams.get('event_name') :
            getRequestParams.get('tag_id') !== null ?
            'tag_id=' + getRequestParams.get('tag_id') : ''
        );

    console.log(sendURL);

    return sendURL;
}