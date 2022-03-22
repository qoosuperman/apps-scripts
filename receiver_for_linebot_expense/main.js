let userProperty = PropertiesService.getUserProperties()
// userProperty.setProperty('expense_sheet_id', '<my-sheet-id>')
let sheetId= userProperty.getProperty('expense_sheet_id')
let spreadSheet = SpreadsheetApp.openById(sheetId)
let mainSheet = spreadSheet.getSheetByName('Response')

// 真正完整的 application 應該可以讓 user 註冊 user id
// userProperty.setProperty('ching_line_id', '<user-id>')
// userProperty.setProperty('wei_line_id', '<user-id>')
let idMapping = {}
idMapping[userProperty.getProperty('ching_line_id')] = '阿瑾'
idMapping[userProperty.getProperty('wei_line_id')] = '阿偉'

// line bot channel access token
// userProperty.setProperty('channel_acces_token', 'token')
let channel_access_token = userProperty.getProperty('channel_acces_token')

// rawMessage would be like "早餐 50"
// 消費在 google sheet 裡面是負數
function recordOnGsheet(rawMessage, userId) {
  let now = new Date()
  let date = Utilities.formatDate(now, 'GMT+8', 'yyyy/MM/dd')
  let who = idMapping[userId]
  let category
  let price
  [category, price] = rawMessage.split(' ')
  if(['買菜', '早餐', '午餐', '晚餐'].includes(category)) {
    mainSheet.appendRow([now, who,	date,	parseInt(price) * -1,	category])  
    return 'ok'
  } else {
    return 'something wrong insert to google sheet'
  }
}

function doPost(e) {
  // 測試用
  // let replyText = JSON.stringify(e.postData.contents)
  // let msg = JSON.parse(e.postData.contents)
  // let events = msg.events[0]
  // let replyToken = events.replyToken // 回覆的 token
  // let payload = {
  //   replyToken: replyToken,
  //   messages: [{
  //     'type': 'text',
  //     'text': replyText
  //   }]
  // }
  // let option = {
  //   'headers': {
  //     'Content-Type': 'application/json; charset=UTF-8',
  //     'Authorization': 'Bearer ' + channel_access_token
  //   },
  //   'method': 'post',
  //   'payload': JSON.stringify(payload)
  // }
  // UrlFetchApp.fetch(
  //   'https://api.line.me/v2/bot/message/reply',
  //   option
  // )

  let msg = JSON.parse(e.postData.contents)
  let events = msg.events[0]
  let replyToken = events.replyToken // 回覆的 token
  let line_text = events.message.text // 抓取使用者傳的訊息內容
  let userId = events.source && events.source.userId // 抓取使用者的 ID，等等用來查詢使用者的名稱
  let result = recordOnGsheet(line_text, userId)
  if(result === 'ok') {
    replyText = '已經記錄到 google sheet!'
  } else {
    replyText = '沒有正常記錄到 google sheet 喔'
  }

  let payload = {
    replyToken: replyToken,
    messages: [{
      'type': 'text',
      'text': replyText
    }]
  }
  let option = {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + channel_access_token
    },
    'method': 'post',
    'payload': JSON.stringify(payload)
  }
          
  UrlFetchApp.fetch(
    'https://api.line.me/v2/bot/message/reply',
    option
  )
}
