function handler(req, res) {
  console.log('Request received:', req.method);
  
  if (req.method === 'POST') {
    const body = req.body || {};
    
    if (body.challenge) {
      return res.status(200).send(body.challenge);
    }
    
    if (body.event && body.event.type === 'message') {
      console.log('Message:', body.event.text);
    }
    
    return res.status(200).send('OK');
  }
  
  res.status(200).send('Bot is working!');
}

module.exports = handler;
