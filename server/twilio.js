handleSms = function (request, response) {
  var sms = request.body;
  if (sms.Body) {
    smsResponse(response, "Thanks for your submission!");
  }
}

var smsResponse = function (response, message) {
  var xml = '<?xml version="1.0" encoding="UTF-8"?><Response><Sms>'+ message +'</Sms></Response>';
  response.writeHead(200, {'Content-Type': 'text/xml'});
  response.end(xml);
};
