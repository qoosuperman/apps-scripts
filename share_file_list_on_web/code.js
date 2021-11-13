var spreadSheet = SpreadsheetApp.getActive()

function onOpen() {
  let menuItems = [
    { name: '更新清單', functionName: 'listFilesInFolder'}
  ]
  spreadSheet.addMenu('雲端硬碟', menuItems)
}

// assign a folder, list the files info in the folder to spreadsheet
function listFilesInFolder() {
  // PropertiesService.getUserProperties().setProperty('share_folder_id', '<your folder id>');
  let folderId = PropertiesService.getUserProperties().getProperty('share_folder_id')
  let sheet = spreadSheet.getSheetByName('file_list')
  sheet.clear()
  sheet.appendRow(['Name', 'Date', 'Size', 'URL', 'Download', 'Description'])
       .setFrozenRows(1)
  let folderToShare = DriveApp.getFolderById(folderId)
  let contents = folderToShare.getFiles()

  let cnt = 0
  while (contents.hasNext()) {
    let file = contents.next()
    let downloadUrl = `https://docs.google.com/uc?export=download&confirm=no_antivirus&id=${file.getId()}`
    data = [
      file.getName(),
      file.getDateCreated(),
      file.getSize(),
      file.getUrl(),
      downloadUrl,
      file.getDescription()
    ]
    sheet.appendRow(data)
    cnt ++
  }
}

// collect the info in spreadsheet, prepare to use in web page
function getData() {
  let sheet = spreadSheet.getSheetByName('file_list')
  let data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues()
  return data
}

function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
  .evaluate()
  .setTitle('下載檔案 from Anthony')
}