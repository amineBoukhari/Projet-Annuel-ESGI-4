const twilioClient = require('../config/twilio');

async function sendWhatsAppMessage(to, body) {
  return twilioClient.messages.create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
    to: `whatsapp:${to}`,
    body,
  });
}

module.exports = { sendWhatsAppMessage };
