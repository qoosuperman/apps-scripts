let userProperty = PropertiesService.getUserProperties()
// userProperty.setProperty('poo_pee_sheet_id', '<my sheet id>')
let sheetId= userProperty.getProperty('poo_pee_sheet_id')
let spreadSheet = SpreadsheetApp.openById(sheetId)

function onFormSubmit(e) {
  var response = e.response;
  var formResponses = response.getItemResponses();
  // // 名字
  var name = formResponses[0].getResponse();
  let mainSheet = spreadSheet.getSheetByName(name + '喝奶整理')

  // 日期，若為空字串 fallback 回今天日期
  var dateText = formResponses[1].getResponse();
  if(dateText === '') {
    date = new Date()
  } else {
    date = TimeUtilis.getAbsoluteDateHour(dateText)
  }
  recordDateText = Utilities.formatDate(date, 'GMT+8', 'yyyy/MM/dd')

  // 時間
  var timeText = formResponses[2].getResponse();

  let dateTimeObject = new Date(recordDateText + ' ' + timeText)
  recordDateTimeText = Utilities.formatDate(new Date(dateTimeObject), 'GMT+8', 'yyyy/MM/dd HH:mm')

  // 配方奶幾 ml
  var infantFormula = formResponses[3].getResponse();
  infantFormula = parseInt(infantFormula)

  // 母奶幾 ml
  var breastMilk = formResponses[4].getResponse();
  breastMilk = parseInt(breastMilk)

  mainSheet.appendRow([recordDateTimeText, infantFormula, breastMilk])
}
