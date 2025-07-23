module.exports = async function handler(req, res) {
  // Environment variables
  const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
  const TEST_CHANNEL = 'C096BUUPWRJ';
  
  const TEAM_MEMBERS = {
    'person1': 'U06PS7F4V8B', // @Melanie Cameron
    'person2': 'U06K65CQ31A', // @Lily Schurra  
    'person3': 'U0473NNB3GA'  // @Sam Mandell
  };

  const ROUTING_RULES = [
    {
      keywords: ['vendor agreement', 'vendor contract'],
      assignee: 'person1',
      type: 'Vendor Agreements'
    },
    {
      keywords: ['nda', 'non-disclosure'],
      assignee: 'person1',
      type: 'NDAs'
    },
    {
      keywords: ['cloud migration', 'migrate to cloud', 'on-prem to cloud', 'dora', 'soc2', 'iso', 'compliance', 'due diligence', 'questionnaire'],
      assignee: 'person1',
      type: 'Compliance'
    },
    {
      keywords: ['msa', 'master agreement', 'amp terms', 'deep search addendum', 'evaluation agreement', 'eval', 'poc'],
      assignee: 'person2', 
      type: 'Commercial Contracts'
    },
    {
      keywords: ['gdpr', 'ccpa', 'privacy', 'data processing', 'data protection'],
      assignee: 'person2',
      type: 'Privacy'
    },
    {
      keywords: ['regulatory', 'regulation', 'regulator'],
      assignee: 'person3',
      type: 'Regulatory'
    },
    {
      keywords: ['product', 'feature'],
      assignee: 'person3',
      type: 'Product'
    },
    {
      keywords: ['employment', 'hiring', 'contractor', 'termination'],
      assignee: 'person3',
      type: 'Employment'
    },
    {
      keywords: ['corporate structure', 'org', 'legal entity', 'subsidiary'],
      assignee: 'person3',
      type: 'Corporate'
    }
  ];

  console.log('Function called, method:', req.method);

  if (req.method === 'POST') {
    const { challenge, event } = req.body;
    
    // Handle URL verification
    if (challenge) {
      return res.status(200).send(challenge);
    }
    
    // Handle message events
    if (event && event.type === 'message' && event.channel === TEST_CHANNEL && !event.bot_id && !event.thread_ts) {
      console.log('Processing message:', event.text);
      
      try {
        // Classify request
        const messageText = event.text.toLowerCase();
        let classification = { type: 'General Legal', assignee: 'person3' };
        
        for (const rule of ROUTING_RULES) {
          let found = false;
          for (const keyword of rule.keywords) {
            if (messageText.includes(keyword.toLowerCase())) {
              classification = rule;
              found = true;
              break;
            }
          }
          if (found) break;
        }
        
        console.log('Classification:', classification);
        
        // Simple ticket numbering
        const timestamp = event.ts.replace('.', '');
        const shortNumber = parseInt(timestamp.slice(-6)) % 100000;
        const ticketNumber = `LGL-${String(shortNumber).padStart(5, '0')}`;
        
        // Get assignee name
        const assigneeNames = {
          'person1': '<@U06PS7F4V8B>',
          'person2': '<@U06K65CQ31A>',
          'person3': '<@U0473NNB3GA>'
        };
        const assigneeName = assigneeNames[classification.assignee];
        
        // Add ticket reaction
        const fetch = (await import('node-fetch')).default;
        
        await fetch('https://slack.com/api/reactions.add', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            channel: event.channel,
            timestamp: event.ts,
            name: 'ticket'
          })
        });
        
        // Reply in thread
        const threadMessage = `🎫 Ticket ${ticketNumber} created
Type: ${classification.type}
Assigned to: ${assigneeName}
Status: Open`;
        
        await fetch('https://slack.com/api/chat.postMessage', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            channel: event.channel,
            text: threadMessage,
            thread_ts: event.ts
          })
        });
        
        console.log(`Created ticket ${ticketNumber} for ${classification.type}`);
        
      } catch (error) {
        console.error('Error processing message:', error);
      }
    }
    
    return res.status(200).send('OK');
  }
  
  res.status(200).send('Legal Request Bot is running!');
};
