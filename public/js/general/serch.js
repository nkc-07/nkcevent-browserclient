function searchUrlGenerater(url) {
    let getRequestParams = (new URL(document.location)).searchParams;

    $('[type=serch]').val(getRequestParams.get('event_name'));
    let sendURL = url +
        (
            getRequestParams.get('event_name') !== null ?
            'event_name=' + getRequestParams.get('event_name') :
            getRequestParams.get('tag') !== null ?
            'tag=' + getRequestParams.get('tag') : ''
        );

    return sendURL;
}