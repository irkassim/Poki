


const questions = [
    {
      category: 'Personality',
      text: 'How do you prefer to spend your weekends?',
      options: [
        'Relaxing at home.',
        'A mix of home and social outings.',
        'Going out and meeting new people.',
        'It depends on my mood and energy level.',
      ],
    },
    {
      category: 'Personality',
      text: 'In social settings, how do you typically feel?',
      options: [
        'I prefer one-on-one or small groups.',
        'I’m comfortable in most group sizes.',
        'I thrive in large, dynamic gatherings.',
        'My comfort depends on the people and setting.',
      ],
    },
    {
      category: 'Personality',
      text: 'How do you recharge your energy?',
      options: [
        'Quiet time alone.',
        'A mix of solitude and activity.',
        'Being around people.',
        'It varies based on how I feel at the time.',
      ],
    },
    {
      category: 'Personality',
      text: 'How do you handle change in your routine?',
      options: [
        'I find it unsettling and prefer predictability.',
        'I adapt to change as needed.',
        'I embrace change and find it exciting.',
        'I weigh the impact of change and adjust accordingly.',
      ],
    },
    {
      category: 'Personality',
      text: 'How do you prefer to make plans?',
      options: [
        'Well in advance.',
        'A balance of planning and spontaneity.',
        'Spontaneously, as opportunities arise.',
        'It depends on the importance of the event.',
      ],
    },
    {
      category: 'Personality',
      text: 'What’s your preferred communication style?',
      options: [
        'Thoughtful and deliberate.',
        'A mix of reflection and spontaneity.',
        'Fast and dynamic.',
        'I adjust based on who I’m communicating with.',
      ],
    },
    {
      category: 'Personality',
      text: 'When faced with a new group of people, how do you act?',
      options: [
        'Observe and take time to warm up.',
        'Gradually join in conversations.',
        'Jump right in and engage.',
        'My response depends on the group dynamic.',
      ],
    },
    {
      category: 'Personality',
      text: 'How do you respond to conflicts?',
      options: [
        'Avoid them and seek harmony.',
        'Address them when necessary.',
        'Face them head-on.',
        'My approach depends on the nature of the conflict.',
      ],
    },
    {
      category: 'Personality',
      text: 'Do you enjoy being the center of attention?',
      options: [
        'Rarely.',
        'Occasionally, depending on the situation.',
        'Often.',
        'It depends on the context and setting.',
      ],
    },
    {
      category: 'Personality',
      text: 'What role do you usually take in group projects?',
      options: [
        'Planner and behind-the-scenes worker.',
        'Flexible, depending on the group’s needs.',
        'Leader or main contributor.',
        'I adapt based on the group dynamic and task.',
      ],
    },
    {
      category: 'Personality',
      text: 'How do you feel about meeting new people?',
      options: [
        'I feel nervous and take time to open up.',
        'I’m generally okay but selective.',
        'I feel excited and energized.',
        'My comfort level depends on the context.',
      ],
    },
    {
      category: 'Personality',
      text: 'How do you prefer to celebrate your birthday?',
      options: [
        'A quiet gathering or alone time.',
        'A small event with close friends.',
        'A big party with many people.',
        'It depends on how I’m feeling that year.',
      ],
    },
    {
      category: 'Personality',
      text: 'How do you manage your free time?',
      options: [
        'Structured schedules and plans.',
        'A mix of plans and spontaneous decisions.',
        'Completely unstructured and go with the flow.',
        'I plan my time depending on my priorities.',
      ],
    },
    {
      category: 'Personality',
      text: 'How do you respond to unexpected invitations?',
      options: [
        'Decline politely.',
        'Consider them carefully.',
        'Accept enthusiastically.',
        'My response depends on the type of invitation.',
      ],
    },
    {
      category: 'Personality',
      text: 'How do you express yourself in conversations?',
      options: [
        'Thoughtfully and after reflection.',
        'Adapt to the flow of the conversation.',
        'Freely and without much filtering.',
        'My approach depends on the topic and audience.',
      ],
    },
    {
      category: 'Personality',
      text: 'How do you prepare for a trip?',
      options: [
        'Plan every detail in advance.',
        'Plan key elements but leave room for flexibility.',
        'Leave everything open-ended.',
        'My planning depends on the destination and purpose.',
      ],
    },
    {
      category: 'Personality',
      text: 'How do you approach learning new skills?',
      options: [
        'Slowly and methodically.',
        'At a comfortable pace.',
        'Quickly and with excitement.',
        'My approach varies based on the skill and context.',
      ],
    },
    {
      category: 'Personality',
      text: 'What kind of hobbies do you enjoy?',
      options: [
        'Quiet, solitary activities.',
        'Activities that can be shared or done alone.',
        'Group activities or adventurous hobbies.',
        'My hobbies depend on my mood and available time.',
      ],
    },
    {
      category: 'Personality',
      text: 'How do you feel about working in teams?',
      options: [
        'I prefer working alone.',
        'I can work well in both setups.',
        'I prefer working in teams.',
        'My preference depends on the team and project.',
      ],
    },
    {
      category: 'Personality',
      text: 'What’s your energy level like throughout the day?',
      options: [
        'Low and steady.',
        'Moderate, with some peaks and troughs.',
        'High and variable.',
        'My energy depends on my activities and schedule.',
      ],
    },
    {
      category: 'Personality',
      text: 'How often do you initiate conversations?',
      options: [
        'Rarely.',
        'Sometimes.',
        'Often.',
        'It depends on the situation and person.',
      ],
    },
    {
      category: 'Personality',
      text: 'How do you feel about hosting social events?',
      options: [
        'I avoid hosting if I can.',
        'I host occasionally when the opportunity arises.',
        'I love hosting and organizing gatherings.',
        'My preference depends on the type of event.',
      ],
    },
    {
      category: 'Personality',
      text: 'How do you deal with being in a crowd?',
      options: [
        'It’s overwhelming for me.',
        'It depends on the situation.',
        'I enjoy the energy of the crowd.',
        'My comfort depends on the purpose of the gathering.',
      ],
    },
    {
      category: 'Personality',
      text: 'How do you feel about public speaking?',
      options: [
        'It’s intimidating.',
        'I can manage it when needed.',
        'I enjoy it.',
        'My confidence depends on the topic and audience.',
      ],
    },
    {
      category: 'Personality',
      text: 'How do you feel after a long day of socializing?',
      options: [
        'Exhausted and needing solitude.',
        'Neutral or balanced.',
        'Energized and fulfilled.',
        'My feelings depend on the type of interactions.',
      ],
    },
    {
      category: 'Personality',
      text: 'How do you prefer to resolve misunderstandings?',
      options: [
        'Avoid confrontation and wait it out.',
        'Discuss calmly and openly.',
        'Address the issue directly and immediately.',
        'My approach depends on the situation and person.',
      ],
    },
    {
      category: 'Personality',
      text: 'What’s your decision-making style?',
      options: [
        'Analytical and cautious.',
        'A mix of analysis and intuition.',
        'Impulsive and instinctive.',
        'My style depends on the stakes of the decision.',
      ],
    },
    {
      category: 'Personality',
      text: 'How do you feel about trying unfamiliar foods?',
      options: [
        'I avoid them.',
        'I’ll try if it looks interesting.',
        'I’m excited to try anything new.',
        'My willingness depends on the food and context.',
      ],
    },
    {
      category: 'Personality',
      text: 'How do you manage your schedule?',
      options: [
        'Rigidly with little room for flexibility.',
        'Moderately structured with some flexibility.',
        'Very loose and spontaneous.',
        'My schedule depends on my goals and priorities.',
      ],
    },
    {
      category: 'Personality',
      text: 'How do you feel about surprises?',
      options: [
        'I don’t like them.',
        'I’m okay with them in moderation.',
        'I love surprises.',
        'My feelings depend on the nature of the surprise.',
      ],
    },
      {
        category: 'Values',
        text: 'How do you feel about adhering to traditional family values?',
        options: [
          'They are essential and should be upheld.',
          'They are important but can be adjusted.',
          'They are outdated and should evolve.',
          'They depend on the situation and context.',
        ],
      },
      {
        category: 'Values',
        text: 'What’s your stance on gender equality?',
        options: [
          'Men and women should follow distinct roles.',
          'Gender roles have their place but should adapt when needed.',
          'Gender roles should be entirely dismantled.',
          'Equality is important but should respect individual choices.',
        ],
      },
      {
        category: 'Values',
        text: 'How do you view free speech in society?',
        options: [
          'It should be absolute and unrestricted.',
          'It’s important, but some limitations are necessary.',
          'It should evolve to protect marginalized groups.',
          'It’s contextual and requires a balance of rights and responsibilities.',
        ],
      },
      {
        category: 'Values',
        text: 'How important is voting to you?',
        options: [
          'It’s a civic duty that should always be exercised.',
          'It’s important but not always necessary.',
          'It’s one of many ways to enact change.',
          'It depends on the circumstances and available candidates.',
        ],
      },
      {
        category: 'Values',
        text: 'What is your opinion on social media activism?',
        options: [
          'It’s ineffective and performative.',
          'It has its place but needs real-world action too.',
          'It’s a powerful tool for creating change.',
          'It depends on how it’s used and the cause.',
        ],
      },
      {
        category: 'Values',
        text: 'How do you feel about immigration policies?',
        options: [
          'Immigration should be heavily controlled.',
          'Policies should be fair but enforce boundaries.',
          'Immigration should be as open as possible.',
          'Policies should balance national needs with global fairness.',
        ],
      },
      {
        category: 'Values',
        text: 'What’s your perspective on organized religion?',
        options: [
          'It’s vital for moral guidance.',
          'It has its benefits but shouldn’t dominate life.',
          'It’s outdated and should be reimagined.',
          'It depends on the religion and its role in a person’s life.',
        ],
      },
      {
        category: 'Values',
        text: 'How do you view environmental issues?',
        options: [
          'Personal responsibility is enough to make a difference.',
          'Both personal and corporate responsibility are needed.',
          'Governments and corporations must take the lead.',
          'Solutions should balance economic and environmental factors.',
        ],
      },
      {
        category: 'Values',
        text: 'How do you feel about taxation?',
        options: [
          'Taxes should be low and government spending minimized.',
          'Taxes are necessary but should be moderate.',
          'Higher taxes on the wealthy are essential for equality.',
          'Tax policies should depend on economic needs.',
        ],
      },
      {
        category: 'Values',
        text: 'What’s your view on equality in education?',
        options: [
          'Traditional systems are fine as they are.',
          'Minor adjustments to current systems are needed.',
          'Radical reforms are required to ensure equity.',
          'Changes should depend on individual community needs.',
        ],
      },
      {
        category: 'Values',
        text: 'How do you feel about the concept of universal healthcare?',
        options: [
          'It’s too expensive and unsustainable.',
          'It’s good but should include private options.',
          'It’s a basic right that should be guaranteed for all.',
          'It depends on the country’s resources and infrastructure.',
        ],
      },
      {
        category: 'Values',
        text: 'What’s your approach to spirituality?',
        options: [
          'I follow a specific set of religious or spiritual beliefs.',
          'I’m spiritual but not tied to one system.',
          'I don’t believe in spirituality.',
          'I explore various perspectives but remain open.',
        ],
      },
      {
        category: 'Values',
        text: 'How do you view the role of government in people’s lives?',
        options: [
          'Government should have minimal involvement.',
          'Government should play a balanced role.',
          'Government should be deeply involved in solving societal issues.',
          'It depends on the specific needs of the time.',
        ],
      },
      {
        category: 'Values',
        text: 'What’s your stance on wealth distribution?',
        options: [
          'Wealth should remain with those who earn it.',
          'Redistribution should happen in extreme cases.',
          'Redistribution is necessary for fairness.',
          'Redistribution depends on the broader economic picture.',
        ],
      },
      {
        category: 'Values',
        text: 'How do you feel about cultural traditions?',
        options: [
          'They should be preserved and followed.',
          'They should adapt to modern times.',
          'They should be challenged or abandoned if outdated.',
          'They should be respected but not imposed.',
        ],
      },
      {
        category: 'Values',
        text: 'How important is freedom of the press?',
        options: [
          'It should be absolute, with no restrictions.',
          'It’s important but needs accountability.',
          'It should prioritize responsible and inclusive reporting.',
          'It depends on the context and societal impact.',
        ],
      },
      {
        category: 'Values',
        text: 'How do you view marriage as an institution?',
        options: [
          'It’s a sacred and essential bond.',
          'It’s important but not for everyone.',
          'It’s outdated and should be redefined.',
          'It’s a personal choice and not necessary for happiness.',
        ],
      },
      {
        category: 'Values',
        text: 'What’s your perspective on crime and punishment?',
        options: [
          'Punishments should be strict to maintain order.',
          'Punishments should balance deterrence and rehabilitation.',
          'The focus should be entirely on rehabilitation.',
          'It depends on the type and severity of the crime.',
        ],
      },
      {
        category: 'Values',
        text: 'How do you feel about animal rights?',
        options: [
          'Humans take precedence over animals.',
          'Animals deserve some protections but within limits.',
          'Animals should have extensive rights and protection.',
          'Rights depend on the animal and its role in society.',
        ],
      },
      {
        category: 'Values',
        text: 'What’s your stance on globalism versus nationalism?',
        options: [
          'Nationalism should come first.',
          'A balance of both is important.',
          'Globalism is essential for progress.',
          'It depends on the situation and issue.',
        ],
      },
      {
        category: 'Values',
        text: 'How do you view personal privacy in the digital age?',
        options: [
          'Sacrificing privacy is acceptable for security.',
          'Privacy and security should be balanced.',
          'Privacy should be prioritized above all.',
          'It depends on the context of the situation.',
        ],
      },
      {
        category: 'Values',
        text: 'What’s your perspective on the role of art in society?',
        options: [
          'Art is a luxury and not essential.',
          'Art has value but should not overshadow practical needs.',
          'Art is vital for cultural and personal growth.',
          'Art’s importance depends on societal priorities.',
        ],
      },
      {
        category: 'Values',
        text: 'How do you feel about freedom of religion?',
        options: [
          'It’s essential but shouldn’t affect public policy.',
          'It’s important but needs boundaries.',
          'It should be absolute and unrestricted.',
          'It depends on the religion and cultural context.',
        ],
      },
      {
        category: 'Values',
        text: 'How do you view progress in science and technology?',
        options: [
          'It should be cautious and slow.',
          'It should advance while addressing ethical concerns.',
          'It should progress as rapidly as possible.',
          'It depends on the specific field and impact.',
        ],
      },
      {
        category: 'Values',
        text: 'How do you view the balance between individual rights and societal needs?',
        options: [
          'Individual rights should always come first.',
          'A balance is necessary, with a slight tilt toward societal needs.',
          'Societal needs should take precedence.',
          'The balance should shift based on the situation.',
        ],
      },
      {
        category: 'Values',
        text: 'What’s your stance on political discussions?',
        options: [
          'I prefer avoiding them.',
          'I engage but aim for balance.',
          'I enjoy diving into them passionately.',
          'I participate selectively, depending on the topic and people involved.',
        ],
      },
      {
        category: 'Values',
        text: 'How do you approach religion?',
        options: [
          'It’s a central part of my life.',
          'I appreciate spirituality but don’t follow strictly.',
          'I’m not religious but open to personal exploration.',
          'My approach depends on my experiences and personal growth.',
        ],
      },
      {
        category: 'Values',
        text: 'How important is family in your decision-making?',
        options: [
          'Very important.',
          'Moderately important.',
          'Somewhat important or not a major factor.',
          'It depends on the decision and its impact on my family.',
        ],
      },
      {
        category: 'Values',
        text: 'How do you feel about social media\'s role in society?',
        options: [
          'It’s harmful and should be limited.',
          'It has both pros and cons.',
          'It’s a powerful tool for connection and change.',
          'Its impact depends on how responsibly it is used.',
        ],
      },
      {
        category: 'Values',
        text: 'How do you view gender roles in relationships?',
        options: [
          'Traditional roles are ideal.',
          'Roles depend on the couple.',
          'Roles are unnecessary or outdated.',
          'Roles should be defined by mutual understanding and individual preferences.',
        ],
      },
      {
        category: 'Mindset',
        text: 'How do you approach challenges?',
        options: [
          'Avoid them if they’re unnecessary.',
          'Take them on when it’s important.',
          'Seek them to grow and learn.'
        ]
      },
      {
        category: 'Mindset',
        text: 'What’s your fitness philosophy?',
        options: [
          'Maintain basic health routines.',
          'Stay active with balance.',
          'Prioritize fitness as a core value.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you respond to failure?',
        options: [
          'Take time to recover and avoid repeating it.',
          'Learn from it but don’t dwell on it.',
          'Use it as a key step toward improvement.'
        ]
      },
      {
        category: 'Mindset',
        text: 'What motivates you to learn?',
        options: [
          'Practical necessity.',
          'A mix of curiosity and necessity.',
          'Pure curiosity and passion.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you approach setting goals?',
        options: [
          'Realistic and achievable goals.',
          'Goals with some room for growth.',
          'Ambitious, stretch goals.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you respond to constructive criticism?',
        options: [
          'I find it uncomfortable and avoid it.',
          'I accept it but don’t always act on it.',
          'I actively seek it to improve.',
          'I analyze it and decide case by case.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you approach setting personal goals?',
        options: [
          'I prefer goals that feel safe and attainable.',
          'I aim for a mix of realistic and ambitious goals.',
          'I push myself to aim as high as possible.',
          'I set goals based on my current priorities and flexibility.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you manage setbacks in life?',
        options: [
          'I prefer to avoid dwelling on them.',
          'I process them slowly but move forward.',
          'I see them as opportunities for growth.',
          'I adjust my approach depending on the situation.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you feel about stepping out of your comfort zone?',
        options: [
          'I find it very difficult and stressful.',
          'I try when it seems worthwhile.',
          'I thrive in unfamiliar situations.',
          'I choose carefully when to take risks.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you approach learning new skills?',
        options: [
          'I focus on what I already know well.',
          'I dabble in new skills but don’t fully commit.',
          'I immerse myself and strive for mastery.',
          'I prioritize new skills that align with my goals.'
        ]
      },
      {
        category: 'Mindset',
        text: 'What’s your attitude toward fitness challenges?',
        options: [
          'I avoid them.',
          'I take them on if they fit my schedule.',
          'I actively seek them out.',
          'I engage when the challenge feels meaningful.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you plan for your long-term health?',
        options: [
          'I rely on basic, familiar habits.',
          'I balance health planning with other priorities.',
          'I consistently strive to optimize my health.',
          'I assess my health goals and adjust as needed.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you feel about trying new activities?',
        options: [
          'I usually stick to familiar routines.',
          'I try them occasionally if I’m comfortable.',
          'I’m always excited to try something new.',
          'I’m selective but open when the timing is right.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you prepare for personal challenges?',
        options: [
          'I take a cautious approach.',
          'I prepare moderately, balancing effort and comfort.',
          'I fully commit to overcoming them.',
          'I evaluate the challenge and adapt my strategy.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you respond to uncertainty?',
        options: [
          'I avoid it whenever possible.',
          'I tolerate it but prefer clarity.',
          'I embrace it as a chance to grow.',
          'I weigh the risks and decide how to respond.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you balance work and personal growth?',
        options: [
          'I focus mostly on work.',
          'I try to balance them but lean toward work.',
          'I prioritize personal growth over work.',
          'I adjust my focus based on what’s most important at the time.'
        ]
      },
      {
        category: 'Mindset',
        text: 'What motivates you to exercise?',
        options: [
          'Basic health and necessity.',
          'To maintain a healthy routine.',
          'To push my physical limits.',
          'To achieve goals that matter most to me.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you approach major life decisions?',
        options: [
          'I prefer sticking with what I know.',
          'I consider pros and cons carefully.',
          'I embrace bold decisions with confidence.',
          'I take a balanced approach, depending on the situation.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you feel about self-improvement programs?',
        options: [
          'I don’t see much value in them.',
          'I find them helpful but don’t commit fully.',
          'I actively participate and follow through.',
          'I evaluate their value before deciding.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you handle failure in fitness goals?',
        options: [
          'I let it discourage me and often stop trying.',
          'I reflect on it and move forward slowly.',
          'I use it as fuel to try harder.',
          'I reframe the goal and adjust my strategy.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you approach mental health practices?',
        options: [
          'I don’t engage much unless absolutely needed.',
          'I practice them occasionally when stressed.',
          'I prioritize mental health as part of my routine.',
          'I focus on mental health in a way that works best for me.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you adapt to changing fitness trends?',
        options: [
          'I stick to what I know works.',
          'I try some trends but don’t fully commit.',
          'I eagerly try new trends and adapt quickly.',
          'I assess trends and incorporate what suits me.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you react to opportunities for personal growth?',
        options: [
          'I often hesitate and prefer the familiar.',
          'I weigh the opportunity carefully before acting.',
          'I seize them enthusiastically.',
          'I choose opportunities that align with my priorities.'
        ]
      },
      {
        category: 'Mindset',
        text: 'What’s your attitude toward change in life?',
        options: [
          'I resist it unless absolutely necessary.',
          'I accept it when needed.',
          'I embrace it as a natural part of growth.',
          'I approach change with a mix of caution and curiosity.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you assess your current lifestyle?',
        options: [
          'It’s comfortable, and I don’t see a need for big changes.',
          'It’s balanced but could use occasional adjustments.',
          'It’s constantly evolving as I grow.',
          'It’s flexible, and I adjust based on new insights.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you approach fitness goals?',
        options: [
          'Maintain basic fitness routines.',
          'Exercise when convenient and needed.',
          'Push myself consistently toward higher fitness levels.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you feel about self-help books?',
        options: [
          'I don’t see much value in them.',
          'They can be useful at times.',
          'I actively seek and read them.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you feel about mental health practices like therapy?',
        options: [
          'I prefer to handle issues myself.',
          'I’m open to them as needed.',
          'I strongly believe in their importance.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you feel about competition?',
        options: [
          'I avoid it.',
          'I don’t mind it occasionally.',
          'I thrive in competitive environments.'
        ]
      },
      {
        category: 'Mindset',
        text: 'How do you handle long-term goals?',
        options: [
          'Break them into small, manageable tasks.',
          'Work on them when time permits.',
          'Go all in and stay focused.'
        ]
      }

      ];

      module.exports={questions}