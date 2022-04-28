let userProperty = PropertiesService.getUserProperties()

// 設定 sheet 相關變數
// userProperty.setProperty('expense_sheet_id', '<my-sheet-id>')
let sheetId= userProperty.getProperty('expense_sheet_id')
let spreadSheet = SpreadsheetApp.openById(sheetId)
let mainSheet = spreadSheet.getSheetByName('Response')

// 建立 user 名字對於 line id 的 mapping
// 真正完整的 application 應該可以讓 user 註冊 user id
// userProperty.setProperty('ching_line_id', '<user-id>')
// userProperty.setProperty('wei_line_id', '<user-id>')
let idMapping = {}
idMapping[userProperty.getProperty('ching_line_id')] = '阿瑾'
idMapping[userProperty.getProperty('wei_line_id')] = '阿偉'

// line bot channel access token
// userProperty.setProperty('channel_acces_token', 'token')
let channel_access_token = userProperty.getProperty('channel_acces_token')

function isTemperatureInput(string) {
  if(!(/\d{2}\.\d{2}/.test(string))) { return false }
  let number = parseFloat(string)
  if(isNaN(string)) { return false }
  if(number < 36 || number > 38) { return false }

  return true
}

function isExpenseInput(string){
  // ex. 買菜100
  return /^\D{1,}\d{1,}$/.test(string)
}

function sendErrorMessage(replyToken) {
  let replyText = '輸入格式不正確喔！'
  replyLineMessage(replyText, replyToken)
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

  // 測試打 API
  // curl https://script.google.com/macros/s/<...>/exec \
  // -H 'Content-Type: application/json' \
  // --data-raw "$(cat ~/Desktop/test.json | grep -v '^\s*//')" \
  // -X POST

  let msg = JSON.parse(e.postData.contents)
  let events = msg.events[0]
  let replyToken = events.replyToken // 回覆的 token
  let line_text = events.message.text // 抓取使用者傳的訊息內容
  let userId = events.source && events.source.userId // 抓取使用者的 ID，等等用來查詢使用者的名稱

  if (isExpenseInput(line_text)) {
    handleExpenseInput(line_text, userId, replyToken)
  } else if (isTemperatureInput(line_text)) {
    handleTemperatureInput(line_text, replyToken)
  } else {
    sendErrorMessage(replyToken)
  }
}
