// userProperty.setProperty('temperature_sheet_id', '<your sheet id>')  
let temperatueSheetId= userProperty.getProperty('temperature_sheet_id')
let temperatureGSheet = SpreadsheetApp.openById(temperatueSheetId)
let temperatureSheet = temperatureGSheet.getSheetByName('main')

// userProperty.setProperty('imgur_client_id', '<your client id>')  
let imgurClientID = userProperty.getProperty('imgur_client_id')

function removeCurrentChart() {
  let charts = temperatureSheet.getCharts()
  let chart = charts[charts.length - 1]
  temperatureSheet.removeChart(chart)
}

function createChart() {
  let dataRange = temperatureSheet.getRange('A1').getDataRegion()
  let lastRow = dataRange.getLastRow()

  let chart = temperatureSheet.newChart()
  .asLineChart()
  .addRange(temperatureSheet.getRange(1,1,lastRow,2))
  .setMergeStrategy(Charts.ChartMergeStrategy.MERGE_COLUMNS)
  .setTransposeRowsAndColumns(false)
  .setNumHeaders(1)
  .setHiddenDimensionStrategy(Charts.ChartHiddenDimensionStrategy.IGNORE_BOTH)
  .setOption('bubble.stroke', '#000000')
  .setOption('useFirstColumnAsDomain', true)
  .setOption('isStacked', 'false')
  .setOption('annotations.domain.textStyle.color', '#808080')
  .setOption('textStyle.color', '#000000')
  .setOption('legend.textStyle.color', '#1a1a1a')
  .setOption('titleTextStyle.color', '#757575')
  .setOption('annotations.total.textStyle.color', '#808080')
  .setXAxisTitle('日期')
  .setOption('hAxis.textStyle.color', '#000000')
  .setYAxisTitle('溫度')
  .setRange(36, 37)
  .setOption('vAxes.0.textStyle.color', '#000000')
  .setPosition(1, 3, 0, 0)
  .build();
  temperatureSheet.insertChart(chart)
  return chart
}

function urlFromImgurWithBlob(blob) {
  let settings = {
    "url": "https://api.imgur.com/3/image",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Authorization": `Client-ID ${imgurClientID}`
    },
    "processData": false,
    "mimeType": "multipart/form-data",
    "contentType": 'multipart/form-data',
    'payload' : blob
  }
  let url = "https://api.imgur.com/3/image"
  let response = UrlFetchApp.fetch(url, settings).getContentText()
  return JSON.parse(response).data.link
}

function handleTemperatureInput(line_text, replyToken) {
  let now = new Date()
  let date = Utilities.formatDate(now, 'GMT+8', 'MM/dd')
  temperatureSheet.appendRow([date,	parseFloat(line_text)])  

  removeCurrentChart()
  let chart = createChart()
  let blob = chart.getBlob()

  replyImage(urlFromImgurWithBlob(blob), replyToken)
}
