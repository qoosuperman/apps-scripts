function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent()
}

function doGet() {
  let template = HtmlService.createTemplateFromFile('index')
  // form 要送到哪個 url 塞到 template 的 serviceUrl 這個屬性
  // 會回傳這個 app 被部署到的 url
  template.serviceUrl = ScriptApp.getService().getUrl()
  return template.evaluate().setTitle('記帳自製表單')
}

function addRecord(date, amount, category) {
  let spreadSheet = SpreadsheetApp.getActive()
  let sheet = spreadSheet.getSheetByName('List')
  // 時間	金額 種類
  sheet.appendRow([date, amount, category])

  let template = HtmlService.createTemplateFromFile('result')
  template.serviceUrl = ScriptApp.getService().getUrl()
  template.date = Utilities.formatDate(date, 'GMT+8', 'yyyy-MM-dd')
  template.amount = amount
  template.category = category
  return template.evaluate()
}