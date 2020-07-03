$(function () {
  // 現在日時
  var current = new Date()

  var year_val = current.getFullYear()
  var month_val = current.getMonth() + 1
  var day_val = current.getDate()

  // プルダウン生成
  $('#year_pulldown').html('<select name="year">')
  // 昇順
  for (var i = 1900; i <= year_val + 1; i++) {
    $('#year_pulldown select').append(
      '<option value="' + i + '">' + i + '</option>'
    )
  }
  // 降順
  // for (var i = year_val + 1; i >= 2000; i--){
  //   $('#year_pulldown select').append('<option value="' + i + '">' + i + '</option>');
  // }
  $('#year_pulldown').append('年')

  $('#month_pulldown').html('<select name="month">')
  for (var i = 1; i <= 12; i++) {
    $('#month_pulldown select').append(
      '<option value="' + i + '">' + i + '</option>'
    )
  }
  $('#month_pulldown').append('月')

  $('#day_pulldown').html('<select name="day">')
  for (var i = 1; i <= 31; i++) {
    $('#day_pulldown select').append(
      '<option value="' + i + '">' + i + '</option>'
    )
  }
  $('#day_pulldown').append('日')

  // デフォルト
  $('select[name=year] option[value=' + year_val + ']').prop('selected', true)
  $('select[name=month] option[value=' + month_val + ']').prop('selected', true)
  $('select[name=day] option[value=' + day_val + ']').prop('selected', true)
})
