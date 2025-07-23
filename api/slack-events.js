export default function handler(req, res) {
  console.log('Slack request received:', req.method);
  
  if (req.method === 'POST') {
    const { challenge } = req.body;
    
    if (challenge) {
      console.log('Challenge:', challenge);
      return res.status(200).send(challenge);
    }
    
    return res.status(200).send('OK');
  }
  
  res.status(200).send('Slack endpoint working!');
}
