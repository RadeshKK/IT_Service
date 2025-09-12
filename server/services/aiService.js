const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Categories and priorities for classification
const CATEGORIES = ['Hardware', 'Software', 'Network', 'Security', 'Account', 'Other'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

// Categorize ticket using AI
const categorizeTicket = async (title, description) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      // Fallback to simple keyword-based categorization
      return categorizeByKeywords(title, description);
    }

    const prompt = `
      Analyze this IT support ticket and categorize it. Return a JSON response with:
      - category: one of ${CATEGORIES.join(', ')}
      - priority: one of ${PRIORITIES.join(', ')}
      - confidence: a number between 0 and 1

      Ticket Title: ${title}
      Description: ${description}

      Consider these guidelines:
      - Hardware: Issues with physical devices, computers, printers, etc.
      - Software: Application problems, bugs, installation issues
      - Network: Connectivity, internet, VPN, server issues
      - Security: Password resets, access issues, security concerns
      - Account: User account management, permissions
      - Other: Anything that doesn't fit the above categories

      Priority guidelines:
      - urgent: System down, security breach, critical business impact
      - high: Major functionality affected, multiple users impacted
      - medium: Minor issues, single user affected
      - low: Cosmetic issues, feature requests

      Return only valid JSON:
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 200
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    // Validate the response
    if (!CATEGORIES.includes(result.category)) {
      result.category = 'Other';
    }
    if (!PRIORITIES.includes(result.priority)) {
      result.priority = 'medium';
    }
    if (typeof result.confidence !== 'number' || result.confidence < 0 || result.confidence > 1) {
      result.confidence = 0.7;
    }

    return result;
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to keyword-based categorization
    return categorizeByKeywords(title, description);
  }
};

// Fallback keyword-based categorization
const categorizeByKeywords = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();
  
  // Hardware keywords
  const hardwareKeywords = ['computer', 'laptop', 'desktop', 'printer', 'monitor', 'keyboard', 'mouse', 'hardware', 'device', 'equipment'];
  // Software keywords
  const softwareKeywords = ['software', 'application', 'app', 'program', 'bug', 'error', 'crash', 'install', 'update', 'version'];
  // Network keywords
  const networkKeywords = ['network', 'internet', 'wifi', 'connection', 'vpn', 'server', 'email', 'website', 'online', 'connectivity'];
  // Security keywords
  const securityKeywords = ['password', 'login', 'access', 'permission', 'security', 'breach', 'hack', 'unauthorized', 'locked'];
  // Account keywords
  const accountKeywords = ['account', 'user', 'profile', 'settings', 'preferences', 'registration', 'signup'];

  let category = 'Other';
  let priority = 'medium';

  // Determine category
  if (hardwareKeywords.some(keyword => text.includes(keyword))) {
    category = 'Hardware';
  } else if (softwareKeywords.some(keyword => text.includes(keyword))) {
    category = 'Software';
  } else if (networkKeywords.some(keyword => text.includes(keyword))) {
    category = 'Network';
  } else if (securityKeywords.some(keyword => text.includes(keyword))) {
    category = 'Security';
  } else if (accountKeywords.some(keyword => text.includes(keyword))) {
    category = 'Account';
  }

  // Determine priority based on urgency keywords
  const urgentKeywords = ['urgent', 'critical', 'down', 'broken', 'not working', 'emergency', 'asap'];
  const highKeywords = ['important', 'major', 'severe', 'serious', 'priority'];
  const lowKeywords = ['minor', 'small', 'cosmetic', 'enhancement', 'feature request'];

  if (urgentKeywords.some(keyword => text.includes(keyword))) {
    priority = 'urgent';
  } else if (highKeywords.some(keyword => text.includes(keyword))) {
    priority = 'high';
  } else if (lowKeywords.some(keyword => text.includes(keyword))) {
    priority = 'low';
  }

  return {
    category,
    priority,
    confidence: 0.6 // Lower confidence for keyword-based approach
  };
};

// Get solution suggestions using AI
const getSolutionSuggestions = async (title, description, category) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return getBasicSuggestions(category);
    }

    const prompt = `
      Based on this IT support ticket, provide 3-5 solution suggestions. Return a JSON array of objects with:
      - title: Brief title of the solution
      - description: Detailed steps to resolve the issue
      - confidence: Number between 0 and 1 indicating how likely this solution will work

      Ticket Title: ${title}
      Description: ${description}
      Category: ${category || 'Unknown'}

      Focus on practical, step-by-step solutions that IT support agents can follow.
      Include common troubleshooting steps, configuration changes, and escalation paths.

      Return only valid JSON array:
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 1000
    });

    const suggestions = JSON.parse(response.choices[0].message.content);
    
    // Validate suggestions
    if (!Array.isArray(suggestions)) {
      return getBasicSuggestions(category);
    }

    return suggestions.map(suggestion => ({
      title: suggestion.title || 'Solution',
      description: suggestion.description || 'No description available',
      confidence: typeof suggestion.confidence === 'number' ? suggestion.confidence : 0.5
    }));
  } catch (error) {
    console.error('OpenAI suggestions error:', error);
    return getBasicSuggestions(category);
  }
};

// Fallback basic suggestions
const getBasicSuggestions = (category) => {
  const basicSuggestions = {
    'Hardware': [
      {
        title: 'Check Physical Connections',
        description: 'Verify all cables are properly connected. Check power supply and restart the device.',
        confidence: 0.8
      },
      {
        title: 'Update Drivers',
        description: 'Download and install the latest drivers from the manufacturer\'s website.',
        confidence: 0.7
      }
    ],
    'Software': [
      {
        title: 'Restart Application',
        description: 'Close the application completely and restart it. Check for any error messages.',
        confidence: 0.8
      },
      {
        title: 'Check for Updates',
        description: 'Look for software updates and install them if available.',
        confidence: 0.7
      }
    ],
    'Network': [
      {
        title: 'Check Internet Connection',
        description: 'Test internet connectivity by opening a web browser and visiting a website.',
        confidence: 0.9
      },
      {
        title: 'Restart Network Equipment',
        description: 'Power cycle the router/modem by unplugging for 30 seconds and plugging back in.',
        confidence: 0.8
      }
    ],
    'Security': [
      {
        title: 'Reset Password',
        description: 'Use the password reset functionality or contact IT to reset the account password.',
        confidence: 0.9
      },
      {
        title: 'Check Account Status',
        description: 'Verify the account is active and not locked. Check with IT if account needs to be unlocked.',
        confidence: 0.8
      }
    ]
  };

  return basicSuggestions[category] || [
    {
      title: 'Gather More Information',
      description: 'Collect additional details about the issue, including error messages and steps to reproduce.',
      confidence: 0.6
    },
    {
      title: 'Escalate to Senior Support',
      description: 'If basic troubleshooting doesn\'t work, escalate to a senior support agent.',
      confidence: 0.5
    }
  ];
};

module.exports = {
  categorizeTicket,
  getSolutionSuggestions
};
