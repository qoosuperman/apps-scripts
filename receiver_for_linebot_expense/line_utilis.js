function replyLineMessage(replyText, replyToken) {
  let payload = {
    replyToken: replyToken,
    messages: [{
      'type': 'text',
      'text': replyText
    }]
  }
  replyWithPayloadAndToken(payload, replyToken)
}

function  replyImage(url, replyToken) {
  let payload = {
    replyToken: replyToken,
    messages: [{
      'type': 'image',
      'originalContentUrl': url,
      'previewImageUrl': url
    }]
  }
  replyWithPayloadAndToken(payload, replyToken)
}

function replyWithPayloadAndToken(payload, replyToken) {
  let option = {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + channel_access_token
    },
    'method': 'post',
    'payload': JSON.stringify(payload)
  }
          
  UrlFetchApp.fetch(
    'https://api.line.me/v2/bot/message/reply',
    option
  )
}
