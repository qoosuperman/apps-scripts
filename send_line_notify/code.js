function sendLineNotify(messageText) {
  var userProperty = PropertiesService.getUserProperties();
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
