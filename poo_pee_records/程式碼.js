let userProperty = PropertiesService.getUserProperties()
// userProperty.setProperty('poo_pee_sheet_id', '<my sheet id>')
let sheetId= userProperty.getProperty('poo_pee_sheet_id')
let spreadSheet = SpreadsheetApp.openById(sheetId)
let mainSheet = spreadSheet.getSheetByName('大小便中間表')

function onFormSubmit(e) {
  var response = e.response;
  var formResponses = response.getItemResponses();
  // 名字
  var name = formResponses[0].getResponse();

  // 日期，若為空字串 fallback 回今天日期
  var dateText = formResponses[1].getResponse();
  if(dateText === '') {
    date = new Date()
  } else {
    date = TimeUtilis.getAbsoluteDateHour(dateText)
  }
  recordDateText = Utilities.formatDate(date, 'GMT+8', 'yyyy/MM/dd')

  // 大便 or 小便
  var pooType = formResponses[2].getResponse();
  var poopCount = /大/.test(pooType) ? 1 : 0;
  var peeCount = /小/.test(pooType) ? 1 : 0;

  mainSheet.appendRow([name, recordDateText, poopCount, peeCount]);
}
