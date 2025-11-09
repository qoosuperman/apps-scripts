let userProperty = PropertiesService.getUserProperties()
// userProperty.setProperty('poo_pee_sheet_id', '<my sheet id>')
let sheetId= userProperty.getProperty('poo_pee_sheet_id')
let spreadSheet = SpreadsheetApp.openById(sheetId)

function onFormSubmit(e) {
  // 增加錯誤處理和除錯資訊
  Logger.log('Event object: ' + JSON.stringify(e));

  // 檢查事件物件是否存在
  if (!e) {
    Logger.log('Error: Event object is undefined');
    return;
  }

  // 檢查 response 是否存在
  if (!e.response) {
    Logger.log('Error: e.response is undefined');
    Logger.log('Available properties: ' + Object.keys(e));
    return;
  }

  var response = e.response;
  var formResponses = response.getItemResponses();
  // // 名字
  var name = formResponses[0].getResponse();
  let mainSheet = spreadSheet.getSheetByName(name + '喝奶整理')

  // 日期，若為空字串 fallback 回今天日期
  var dateText = formResponses[1].getResponse();
  Logger.log(dateText)
  Logger.log(typeof(dateText))
  if(dateText === '') {
    date = new Date()
  } else {
    date = TimeUtilis.getAbsoluteDateHour(dateText)
  }
  recordDateText = Utilities.formatDate(date, 'GMT+8', 'yyyy/MM/dd')

  // 時間
  var timeText = formResponses[2].getResponse();
    Logger.log(timeText)
  Logger.log(typeof(timeText))

  let dateTimeObject = new Date(recordDateText + ' ' + timeText)
  recordDateTimeText = Utilities.formatDate(new Date(dateTimeObject), 'GMT+8', 'yyyy/MM/dd HH:mm')

  // 配方奶幾 ml
  var infantFormula = formResponses[3].getResponse();
  infantFormula = parseInt(infantFormula)
  Logger.log(infantFormula)
  Logger.log(typeof(infantFormula))

  // 母奶幾 ml
  var breastMilk = formResponses[4].getResponse();
  breastMilk = parseInt(breastMilk)
  Logger.log(breastMilk)
  Logger.log(typeof(breastMilk))

  var allMilk = infantFormula + breastMilk

  mainSheet.appendRow([recordDateTimeText, infantFormula, breastMilk, allMilk])
}
