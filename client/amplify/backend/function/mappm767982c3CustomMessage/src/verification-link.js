
/**
 * @type {import('@types/aws-lambda').CustomMessageTriggerHandler}
 */
exports.handler = async (event) => {
  // Define the URL that you want the user to be directed to after verification is complete
  if (event.triggerSource === 'CustomMessage_SignUp') {
    const { codeParameter } = event.request;

    const message = `${process.env.EMAILMESSAGE}

Your verification code is: ${codeParameter}

Please enter this code on the verification page to complete your registration.`;

    event.response.smsMessage = message;
    event.response.emailSubject = process.env.EMAILSUBJECT;
    event.response.emailMessage = message;
    console.log('event.response', event.response);
  }

  return event;
};
