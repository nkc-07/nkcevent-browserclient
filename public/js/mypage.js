$.ajax({
        url: '/api/member/memberinfo.php', //送信先
        type: 'GET', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            token: localStorage.getItem('token')
        }
    })
    .done(function(response) {
        let memberInfo = response['data']['info']
        let memberTag = response['data']['tag']



        console.log(memberInfo)
        console.log(memberTag)
    })
    .fail(function(response) {})