module.exports = function(req, res) {
  if (req.method === 'POST') {
    const body = req.body;
    
    if (body.challenge) {
      return res.status(200).send(body.challenge);
    }
    
    if (body.event && body.event.type === 'message') {
      console.log('Got message:', body.event.text);
    }
    
    return res.status(200).send('OK');
  }
  
  res.status(200).send('Bot working');
};
