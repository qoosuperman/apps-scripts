// rawMessage would be like "早餐 50"
// 消費在 google sheet 裡面是負數
function recordOnGsheet(rawMessage, userId) {
  let now = new Date()
  let date = Utilities.formatDate(now, 'GMT+8', 'yyyy/MM/dd')
  let who = idMapping[userId]
  let category = rawMessage.match(/\D*/)[0]
  let price = rawMessage.match(/\d{1,8}/)[0]
  if(['買菜', '早餐', '午餐', '晚餐'].includes(category)) {
    mainSheet.appendRow([now, who,	date,	parseInt(price) * -1,	category])
    return 'ok'
  } else if(['飲料', '餅乾'].includes(category)) {
    mainSheet.appendRow([now, who,	date,	parseInt(price) * -1,	'點心飲料', category])
    return 'ok'
  } else if(['加油', '停車'].includes(category)) {
    mainSheet.appendRow([now, who,	date,	parseInt(price) * -1,	'汽機車', category])
    return 'ok'
  } else {
    return 'something wrong insert to google sheet'
  }
}

function handleExpenseInput(line_text, userId, replyToken) {
  let replyText
  let result = recordOnGsheet(line_text, userId)
  if(result === 'ok') {
    replyText = '已經記錄到 google sheet!'
  } else {
    replyText = '沒有正常記錄到 google sheet 喔，目前支援的種類：買菜, 早餐, 午餐, 晚餐, 飲料, 餅乾, 加油, 停車'
  }
  replyLineMessage(replyText, replyToken)
}