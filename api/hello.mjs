export default function handler(req, res) {
  console.log('Request received:', req.method);
  
  if (req.method === 'POST') {
    const { challenge, event } = req.body;
    
    if (challenge) {
      return res.status(200).send(challenge);
    }
    
    if (event && event.type === 'message') {
      console.log('Message:', event.text);
      console.log('Channel:', event.channel);
    }
    
    return res.status(200).send('OK');
  }
  
  res.status(200).send('Bot is working!');
}
