var userProperty = PropertiesService.getUserProperties()
// userProperty.setProperty('lineNotifyToken','<your line notify token>')
var token = userProperty.getProperty('lineNotifyToken')

function sendLineNotify(messageText) {
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

function sendTextAndImage(text, blob) {
  var boundary = "cutHere";
  var requestBody = Utilities.newBlob(
    "--" + boundary + "\r\n"
    + "Content-Disposition: form-data; name=\"message\"; \r\n\r\n" + text + "\r\n"
    + "--" + boundary + "\r\n"
    + "Content-Disposition: form-data; name=\"imageFile\"; filename=\"" + blob.getName() + "\"\r\n"
    + "Content-Type: " + "image/png" +"\r\n\r\n").getBytes();
  requestBody = requestBody.concat(blob.getBytes());
  requestBody = requestBody.concat(Utilities.newBlob("\r\n--" + boundary + "--\r\n").getBytes());
  var options = {
    "method" : "post",
    "headers" : { "Authorization" : "Bearer " + token },
    "contentType" : "multipart/form-data; boundary=" + boundary,
    "payload" : requestBody
  }
  UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options)
}
