let userProperty = PropertiesService.getUserProperties()
// userProperty.setProperty('expense_sheet_id', '<my sheet id>')
let sheetId= userProperty.getProperty('expense_sheet_id')
let spreadSheet = SpreadsheetApp.openById(sheetId)
let mainSheet = spreadSheet.getSheetByName('Response')
// 可以自己指定日期
// let today = new Date(2021,9,1)
let today = new Date()
//  The number would be actual number - ex. Jan => 0
let lastMonth = parseInt(today.getMonth()) - 1
let lastMonthString = TimeUtilis.dateToMonthString(new Date(
                                                    today.getFullYear(),
                                                    today.getMonth() - 1,
                                                    1
                                                  ))

function main() {
  let data  = allSheetData()
  let lastMonthExpenses = fetchLastMonthExpenses(data)
  let newSheet = pasteToNewSheet(lastMonthExpenses)
  deleteFromOldSheet(data)
  // 把支出加上負號，收入加總單獨紀錄
  reorganizeSheet(newSheet)
  // 樞紐分析
  createPivotTable(newSheet)
  let chart = createPieChart(newSheet)
  sendSummary(newSheet, chart)
}

function allSheetData() {
  let lastRow = mainSheet.getLastRow()
  let data  = mainSheet.getRange(2,1, lastRow - 1, 6).getValues()
  return data
}

function fetchLastMonthExpenses(data) {
  // 第三欄是消費/收入日期
  return data.filter(function(item){
    return item[2].getMonth() === lastMonth
  })
}

function pasteToNewSheet(expenses) {
  let newSheet = spreadSheet.insertSheet()
  newSheet.setName(lastMonthString)
  newSheet.appendRow(['timestamp', 'who',	'date',	'amount',	'category', 'comment'])
  let rowsSize = expenses.length
  newSheet.getRange(2, 1, rowsSize, 6).setValues(expenses)
  return newSheet
}

function deleteFromOldSheet(data) {
  // 刪除原本 sheet 的資料
  // 要從後面往前刪除，否則會影響後面的列數
  // date[0] 會是第二列
  for (let i = data.length - 1; i>=0; i--) {
    if(data[i][2].getMonth() === lastMonth) {
      mainSheet.deleteRow(i + 2)
    }
  }
}

function reorganizeSheet(sheet) {
  // 樞紐分析不能使用負值，所以先複製 cost 那一列，並加上負號
  // 如果是正的，代表收入，另外加總放在另一個 cell
  sheet.insertColumnAfter(5)
  sheet.getRange('F1').setValue('cost')
  let lastRow = sheet.getLastRow()
  let expenses = sheet.getRange(2, 4, lastRow - 1, 1).getValues().flat()
  let earned = 0
  for(let i=0; i < expenses.length; i++){
    if(expenses[i] < 0){
      sheet.getRange(i+2, 6,1,1).setValue(expenses[i] * -1)
    } else {
      earned = earned + expenses[i]
    }
  }

  // 記錄總收入
  sheet.getRange('I1').setValue('total earned')
  sheet.getRange('I2').setValue(earned)
}

function createPivotTable(sheet) {
  let lastRow = sheet.getLastRow()
  let sourceData = sheet.getRange(1,1,lastRow,7);
  var pivotTable = sheet.getRange('K1').createPivotTable(sourceData)
  // 用第六欄做分析
  pivotTable.addPivotValue(6, SpreadsheetApp.PivotTableSummarizeFunction.SUM);
  // 用第五欄做分類依據
  var pivotGroup = pivotTable.addRowGroup(5)
  return sheet.getRange('K1').getDataRegion()
}

function createPieChart(sheet) {
  let dataRange = sheet.getRange('K1').getDataRegion()
  // 要去除樞紐分析的最後一列
  let lastRow = dataRange.getLastRow() - 1
  let chart = sheet.newChart()
                .asPieChart()
                .addRange(sheet.getRange(1,11,lastRow,2))
                .setMergeStrategy(Charts.ChartMergeStrategy.MERGE_COLUMNS)
                .setTransposeRowsAndColumns(false)
                .setNumHeaders(1)
                .setHiddenDimensionStrategy(Charts.ChartHiddenDimensionStrategy.IGNORE_BOTH)
                .setOption('bubble.stroke', '#000000')
                .setOption('useFirstColumnAsDomain', true)
                .setOption('pieSliceText', 'value')
                .setOption('title', `${lastMonthString} 支出表`)
                .setOption('annotations.domain.textStyle.color', '#808080')
                .setOption('textStyle.color', '#000000')
                .setOption('legend.textStyle.color', '#1a1a1a')
                .setOption('legend.textStyle.bold', true)
                .setOption('pieSliceTextStyle.color', '#000000')
                .setOption('pieSliceTextStyle.bold', true)
                .setOption('titleTextStyle.color', '#757575')
                .setOption('titleTextStyle.alignment', 'center')
                .setOption('titleTextStyle.bold', true)
                .setOption('annotations.total.textStyle.color', '#808080')
                .setPosition(lastRow + 2, 11, 0, 0)
                .build();
  sheet.insertChart(chart)
  return chart
}

function sendSummary(sheet, chart) {
  let totalEarned = sheet.getRange('I2').getValue()
  let lastRow = sheet.getRange('K1').getDataRegion().getLastRow()
  let totalSpent = sheet.getRange(lastRow, 12, 1, 1).getValue()
  let tmpFile = DriveUtilis.tempFileCreate(chart.getBlob().setName(`${lastMonthString}.png`))
  let blob = tmpFile.getBlob()
  SendLineNotify.sendTextAndImage(`${lastMonthString}\n總支出: ${totalSpent}\n總收入: ${totalEarned}`, blob)
  DriveUtilis.tempFolderCleanUp()
}