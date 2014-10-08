// Result state
//   0 - contact initiated
//   1 - last connection was successul
//   2 - last connection was dropped

// Submission state
//  -1 - no info received
//   0 - no info received, ready to receive info
//   1 - location name received
//   2 - strain name received
//   3 - drug resistance info received
//   4 - treatment info received
//   5 - number of cases received

var SUBMISSION_FINISHED = 5;

handleSms = function (request, response) {
  var sms = request.body;
  if (sms.Body) {
    var phone = Phones.findOne({ number: sms.From });
    if (!phone) {
      var phone = Phones.findOne(Phones.insert({
        number: sms.From,
        result_state: 0,
        submission_state: -1,
      }));
    }
    var result_state = phone.result_state;
    var submission_state = phone.submission_state;
    var responseMessage = responseFromState(result_state, submission_state, phone.previous_location);
    var newState = newStateFromState(result_state, submission_state);
    var paramsUpdate = _.extend(paramsUpdateFromMessage(result_state, submission_state, phone.previous_location, sms.Body), {
      result_state: newState[0],
      submission_state: newState[1],
    });
    Phones.update(phone._id, { $set: paramsUpdate });
    smsResponse(response, responseMessage);
    actOnMessage(phone, result_state, submission_state, sms.Body);
    console.log(Phones.findOne(phone._id));
  }
};

var smsResponse = function (response, message) {
  var xml = '<?xml version="1.0" encoding="UTF-8"?><Response><Sms>'+ message +'</Sms></Response>';
  response.writeHead(200, {'Content-Type': 'text/xml'});
  response.end(xml);
};

var responseFromState = function (result_state, submission_state, previous_location) {
  switch (submission_state) {
    case -1:
      switch (result_state) {
        case 0:
          return "Thank you for contacting the disease hotline. Where are you located?";
        case 1:
          return "Hello again! If you are still at \"" + previous_location + "\" respond \"YES\", otherwise please reply with your location.";
        case 2:
          return "Your last session timed out. Please respond with your location to begin again.";
      }
    case 0:
      return "What is the strain of the disease you are reporting?";
    case 1:
      return "What info do you have about the disease's resistances?";
    case 2:
      return "What have you treated the disease with?";
    case 3:
      return "How many cases of the disease have occured at your location?";
    case 4:
      return "Thank you! You may reply with additional notes or reply \"DONE\" to submit.";
    case 5:
      return "Your report has been submitted.";
  }
}

var newStateFromState = function (result_state, submission_state) {
  if (submission_state != SUBMISSION_FINISHED) {
    return [result_state, submission_state + 1];
  }
  return [1, -1];
}

var paramsUpdateFromMessage = function (result_state, submission_state, previous_location, message) {
  switch (submission_state) {
    case 0:
      if (result_state == 1 && message.trim().toLowerCase() == 'yes') {
        return { incident_location: previous_location };
      } else {
        return { incident_location: message };
      }
    case 1:
      return { incident_strain: message };
    case 2:
      return { incident_drug: message };
    case 3:
      return { incident_treatment: message };
    case 4:
      return { incident_cases: message };
    case 5:
      if (message.trim().toLowerCase() != 'done') {
        return { incident_notes: message };
      }
      break;
  }
  return {};
}

var actOnMessage = function (phone, result_state, submission_state, message) {
  if (submission_state == SUBMISSION_FINISHED) {
    addSubmission({
      location: phone.incident_location,
      strain: phone.incident_strain,
      drug: phone.incident_drug,
      treatment: phone.incident_treatment,
      cases: phone.incident_cases,
      notes: phone.incident_notes,
    });
    var location = phone.incident_location;
    Phones.update(phone._id, {
      $set: {
        previous_location: location,
      },
      $unset: {
        incident_location: "",
        incident_strain: "",
        incident_drug: "",
        incident_treatment: "",
        incident_cases: "",
        incident_notes: "",
      },
    });
  }
}

var addSubmission = function (postAttributes) {
  var post = _.extend(_.pick(postAttributes, 'location', 'strain', 'notes', 'drug', 'cases', 'treatment'), {
    userId: undefined,
    lat: 0,
    lng: 0,
    author: 'mobile user',
    submitted: new Date().getTime(),
    edited: new Date().getTime(),
    commentsCount: 0,
    starrs: [],
    votes: 0,
  });
  var postId = Posts.insert(post);
  Meteor.call('geocode', postId, postAttributes.location);
}
