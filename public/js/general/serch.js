function searchUrlGenerater() {
    let getRequestParams = (new URL(document.location)).searchParams;

    $('[type=serch]').val(getRequestParams.get('event_name'));
    let sendURL = '/api/event/eventlist.php?' +
        (
            getRequestParams.get('event_name') !== null ?
            'event_name=' + getRequestParams.get('event_name') : ''
        );

    return sendURL;
}