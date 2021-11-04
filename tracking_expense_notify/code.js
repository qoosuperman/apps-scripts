function trackingExpenseNotify() {
  var userProperty = PropertiesService.getUserProperties()
  var url = userProperty.getProperty('url_link')
  SendLineNotify.sendLineNotify('今天記帳了嗎?' + url)
}
