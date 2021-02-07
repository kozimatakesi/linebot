// LINEチャンネルトークン
const channelToken = 'D33j/8u58cnPtu/kCKba3mhP7FBtbg5aQkoDn7ztlLlzHbeNpOCxEhNMTPAqFFNUDZ9m425QOmrL8evEeUkF3omFZSXD3P+26j1TqL+rbKHqrWvSZWGK8NCnZL17Ff6DcOAKLnn38m66gmqFbsrzzQdB04t89/1O/w1cDnyilFU=';

// メッセージ受信時
function doPost(e) {
  const { replyToken } = JSON.parse(e.postData.contents).events[0];
  if (typeof replyToken === 'undefined') {
    return;
  }
  const url = 'https://api.line.me/v2/bot/message/reply';
  var input = JSON.parse(e.postData.contents).events[0].message;
  const obj = JSON.parse(e.postData.contents);
  var input = obj.events[0].message;
  const { events } = obj;
  // グローバル変数でuser_idを定義
  user_id = events[0].source.userId;

  // 基本応答
  let message = '半角の ! を入力した後にエキスパンション名を入力してください';
  const messageList = [];
  if (input.type == 'text') {
    // 入力に!が含まれている場合
    if (input.text.match('!')) {
      const inputName = input.text.substr(1, input.text.length);
      const number = get_expantion_number(inputName);
      const getUrl = `https://www.hareruyamtg.com/ja/products/search?cardset=${number.number}&rarity%5B0%5D=4&rarity%5B1%5D=3&foilFlg%5B0%5D=0&sort=price&order=DESC&page=1`;
      const html = UrlFetchApp.fetch(getUrl).getContentText('UTF-8');
      const name_list = Parser.data(html).from('class="itemName">').to('</a>').iterate();
      const price_list = Parser.data(html).from('<p class="itemDetail__price">').to('</p>').iterate();
      const spreadsheet = SpreadsheetApp.openById('1WJ_5jro7NYBpOFlfKKjhfrlVMuWTvA86cytE_MtYEQI');
      const sheet = spreadsheet.getSheetByName('カード名');
      const lastrow = sheet.getLastRow();
      let recordrow = 2;
      sheet.getRange(`A${recordrow}`).setValue(name_list[0]);
      for (var i = 0; i < 10; i++) {
        name_list[i] = name_list[i].replace(/&#039;/, '’');
        sheet.getRange(`A${recordrow}`).setValue(name_list[i].trim());
        sheet.getRange(`B${recordrow}`).setValue(price_list[i]);
        recordrow++;
      }

      messageList.push(`エキスパンション:${number.name}`);
      for (var i = 2; i < 12; i++) {
        const rangeName = sheet.getRange(`A${i}`).getValue();
        const rangePrice = sheet.getRange(`B${i}`).getValue();
        const pushObject = `第${i - 1}位\n${rangeName}\n${rangePrice}`;
        messageList.push(pushObject);
      }
      message = messageList[0];
      var message1 = messageList[1];
      var message2 = messageList[2];
      var message3 = messageList[3];
      var message4 = messageList[4];
    }
  }

  // 晴れる屋が設定しているエキスパンションのNo.を取得するための関数
  function get_expantion_number(expantionName) {
    const getUrl = 'https://www.hareruyamtg.com/ja/';
    const html = UrlFetchApp.fetch(getUrl).getContentText('UTF-8');
    const name = expantionName;
    const expantionArray = Parser.data(html).from('<option').to('/option>').iterate();
    const arrayCount = [];
    const arrayNumber = [];
    for (let i = 0; i < expantionArray.length; i++) {
      if (expantionArray[i].match(name)) {
        var expantionName = Parser.data(expantionArray[i]).from('>').to('<').iterate();
        const expantionNumber = Parser.data(expantionArray[i]).from('value="').to('"').iterate();
        arrayCount.push({ number: expantionNumber, name: expantionName });
        arrayNumber.push(expantionNumber);
      }
    }

    // 複数ヒットした場合、一番若いエキスパンションのNo.を返す
    if (arrayCount.length === 1) {
      return arrayCount[0];
    }
    const minNumber = Math.min(...arrayNumber);
    const result = arrayCount.find((item) => item.number == minNumber);
    return result;
  }

  var messages = [{
    'type': 'text',
    'text': message,
  }];

  UrlFetchApp.fetch(url, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: `Bearer ${channelToken}`,
    },
    method: 'post',
    payload: JSON.stringify({
      replyToken,
      messages,
    }),
  });

  // 5~10位の送信を行う
  createMessage(messageList[1]);
  createMessage(messageList[2]);
  createMessage(messageList[3]);
  createMessage(messageList[4]);
  createMessage(messageList[5]);
  createMessage(messageList[6]);
  createMessage(messageList[7]);
  createMessage(messageList[8]);
  createMessage(messageList[9]);
  createMessage(messageList[10]);

  return ContentService.createTextOutput(JSON.stringify({ content: 'post ok' })).setMimeType(ContentService.MimeType.JSON);
}

// メッセージを定義する
function createMessage(num5) {
  message = num5;
  return push(message);
}

// メッセージを送信する関数
function push(text) {
  const to = user_id;
  const url = 'https://api.line.me/v2/bot/message/push';
  const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    Authorization: `Bearer ${channelToken}`,
  };
  // push内容
  const postData = {
    to,
    messages: [
      {
        type: 'text',
        text,
      },
    ],
  };

  const options = {
    method: 'post',
    headers,
    payload: JSON.stringify(postData),
  };

  return UrlFetchApp.fetch(url, options);
}
