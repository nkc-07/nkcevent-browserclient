$(function() {
    data = { // TODO: ajaxにて最大数を持ってくる処理を追加
        'max': 10
    };

    let now = getRequestParams.get('page') == null ? 1 : getRequestParams.get('page');
    now = Number(now);

    generateGetUrl(now - 1, $('.pagination .back'));
    generateGetUrl(now + 1, $('.pagination .next'));
    if (now == 1) {
        $('.pagination .back').addClass('disabled');
    }

    let pagerItem = $('.pagination .page-item.list-item').clone();

    if (now > 2) {
        addPagerItem(pagerItem.clone(), 1, false);
        if (now != 3) {
            addPagerItem(pagerItem.clone(), '...', true);
        }
    }

    let pageCnt = (
        now > 2 ?
        (now <= data['max'] - 2 ?
            now - 1 : data['max'] - 2
        ) : 1
    );
    for (let i = 0; i < 3; i++) {
        let currentDom = addPagerItem(pagerItem.clone(), pageCnt, false);

        if (now == pageCnt) {
            currentDom.addClass('active');
        }

        pageCnt++;
    }

    if (now <= data['max'] - 2) {
        if (now != data['max'] - 2) {
            addPagerItem(pagerItem.clone(), '...', true);
        }
        addPagerItem(pagerItem.clone(), data['max'], false);
    }

    if (now == data['max']) {
        $('.pagination .next').addClass('disabled');
    }
})

function addPagerItem(dom, insertValue, is_disabled) {
    let pagerItemDom = dom.clone();
    $('.pagination .pahe-item-list').append(pagerItemDom.show());
    pagerItemDom.find('.page-link').text(insertValue);
    if (is_disabled) {
        pagerItemDom.addClass('disabled');
    }
    generateGetUrl(insertValue, pagerItemDom);

    return pagerItemDom;
}

function generateGetUrl(value, dom) {
    let pageGetRequest = location.search.split('&').find(
        element => element.match('page=*') !== null
    );

    if (pageGetRequest === undefined) {
        dom.find('a').attr('href', (location.search ? '&' : '?') + 'page=' + value);
    } else {
        dom.find('a').attr('href', location.href.replace(pageGetRequest, '?page=' + value));
    }
}