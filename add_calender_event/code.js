function onOpen() {
  let spreadSheet = SpreadsheetApp.getActiveSpreadsheet()  
  let menuItems = [
    {name: 'insertEvents', functionName: 'addEvents'}
  ]
  spreadSheet.addMenu('在日曆上加入事件', menuItems)
}

function dropDownList() {
  let spreadSheet = SpreadsheetApp.getActiveSpreadsheet()
  let mainSheet = spreadSheet.getSheetByName('eventList')
  // set colors
  let colorList = spreadSheet.getSheetByName('colors').getRange('B2:B12').getValues()
  let colorRangeRule = SpreadsheetApp.newDataValidation().requireValueInList(colorList)

  let lastRow = mainSheet.getLastRow()
  mainSheet.getRange(2, 5, lastRow-1).setDataValidation(colorRangeRule)
}

function addEvents() {
  let publishMessage = '已發布'
  let spreadSheet = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = spreadSheet.getSheetByName('eventList')
  let range = sheet.getDataRange()
  let values = range.getValues()
  let userProperty = PropertiesService.getUserProperties()
  // userProperty.setProperty('my_email', '<my mail>')
  // userProperty.setProperty('my_wife_email', '<my wife's mail>')
  // userProperty.setProperty('me_wife_calender_id', '<our calender id>')
  let myEmail = userProperty.getProperty('my_email') 
  let wifeEmail = userProperty.getProperty('my_wife_email') 
  let calenderId = userProperty.getProperty('me_wife_calender_id') 

  // values.length 拿列的數量
  for(let i=1; i < values.length; i++) {
    let status = sheet.getRange(i+1, 7).getValue()
    if(status !== publishMessage) {
      let eventTitle = values[i][0]
      let startAt = TimeUtilis.getAbsoluteDateHour(values[i][1]).toISOString()
      let endAt = TimeUtilis.getAbsoluteDateHour(values[i][2]).toISOString()
      let location = values[i][3]
      let eventColor = values[i][4]
      let description = values[i][5] || 'No description'
      let options = {
        summary: eventTitle,
        location: location,
        description: description,
        start: {
          dateTime: startAt
        },
        end: {
          dateTime: endAt
        },
        attendees: [
          {email: wifeEmail},
          {email: myEmail}
        ],
        colorId: eventColor   
      }
      // To user Calender, the service must be turn on
      let event = Calendar.Events.insert(options, calenderId);
      let eventId = event.getId()
      
      sheet.getRange(i+1, 7).setValue(publishMessage)
      sheet.getRange(i+1,8).setValue(eventId)
    }
  }
}

 