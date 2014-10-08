// 0 - contact initiated, ready to start receiving info
// 1 - last connection was successul, ready to start receiving info
// 2 - last connection was dropped, ready to start receiving info
// 3 - location name received
// 4 - latitude received
// 5 - longitude received
// 6 - strain name received
// 7 - drug resistance info received
// 8 - treatment info received
// 9 - number of cases received

handleSms = function (request, response) {
  var sms = request.body;
  if (sms.Body) {
    var phone = Phones.findOne({ number: sms.From });
    if (!phone) {
      var phone = Phones.findOne(Phones.insert({ number: sms.From, state: 0 }));
    }
    switch (phone.state) {
      case 0:
        smsResponse(response, "Nuclear missile armed and ready.");
        Phones.update(phone, { $set: { state: 1 } });
        break;
      case 1:
        smsResponse(response, "Nuclear missile disarmed!");
        Phones.update(phone, { $set: { state: 0 } });
        break;
    }
  }
}

var smsResponse = function (response, message) {
  var xml = '<?xml version="1.0" encoding="UTF-8"?><Response><Sms>'+ message +'</Sms></Response>';
  response.writeHead(200, {'Content-Type': 'text/xml'});
  response.end(xml);
};
