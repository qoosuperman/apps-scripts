function sendLineNotify(messageText) {
  var userProperty = PropertiesService.getUserProperties();
  // userProperty.setProperty('lineNotifyToken','<your line notify token>')
  var token = userProperty.getProperty('lineNotifyToken')
  var options = {
    "method" : "post",
    "headers" : { "Authorization" : "Bearer " + token },
    "payload" : {
      "message" : messageText
    }
  }
  UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options)
}
