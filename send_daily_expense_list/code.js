var userProperty = PropertiesService.getUserProperties();

function collectTodayExpenseAndSend() {
  // userProperty.setProperty('expense_sheet_id', '<my sheet id>');
  let sheetId= userProperty.getProperty('expense_sheet_id')
  // header
  // [時間戳記	你是誰	消費/收入日期	消費/收入金額(消費為負 收入為正)	消費種類	備註]
  let spreadSheet = SpreadsheetApp.openById(sheetId)
  let sheet = spreadSheet.getSheetByName('Response')
  let today = dateToString(new Date())
  let lastRow = sheet.getLastRow()
  let data  = sheet.getRange(2,1, lastRow - 1, 6).getValues()
  // 消費/收入日期
  let todayExpenses = data.filter(function(item){
    return dateToString(item[2]) === today
  })
  let groupedExpenses = groupBy(todayExpenses, '1')
  let text = "今天消費\n"
  if ('阿偉' in groupedExpenses) {
    text = text + "阿偉：\n" + groupedExpenses['阿偉'].map(x => `    種類：${x[4]}，花費：${-x[3]}`).join("\n")
  }
  if ('阿瑾' in groupedExpenses) {
    text = text + "阿瑾：\n" + groupedExpenses['阿瑾'].map(x => `.   種類：${x[4]}，花費：${-x[3]}`).join("\n")
  }
  SendLineNotify.sendLineNotify(text)
}

function dateToString(date){
  return Utilities.formatDate(date, 'GMT+8', 'yyyy-MM-dd')
}

function groupBy(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}
