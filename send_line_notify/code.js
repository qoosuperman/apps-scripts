var userProperty = PropertiesService.getUserProperties();

function sendLineNotify(messageText) {
  // userProperty.setProperty('lineNotifyToken','<your line notify token>')
  var token = userProperty.getProperty('lineNotifyToken')
  var options = {
    "method" : "post",
    "headers" : { "Authorization" : "Bearer " + token },
    "payload" : {
      "message" : `${pickEmoticon()}\n${messageText}`
    }
  }
  UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options)
}

function pickEmoticon() {
  // userProperty.setProperty('emoticon_sheet','<your line notify token>')
  let emoticonSheetId = userProperty.getProperty('emoticon_sheet')

  Array.prototype.sample = function() {
    return this[Math.floor(Math.random()*this.length)];
  }
  let sheet = SpreadsheetApp.openById(emoticonSheetId).getActiveSheet()
  let lastRow = sheet.getLastRow()
  let emoticons = sheet.getRange(1, 1, lastRow).getValues().flat()
  return emoticons.sample()
}
