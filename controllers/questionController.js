const Question = require('../models/question');
const User = require('../models/user');


exports.getCompatibilityTest = async (req, res) => {
  console.log((" Getting Questions"))

  try {
    const randomQuestions = await Promise.all(
      ['Personality', 'Values', 'Mindset'].map(async (category) => {
        return Question.aggregate([
          { $match: { category } },
          { $sample: { size: 6 } }, // Fetch 6 random questions per category
        ]);
      })
    );

    console.log("TheQuestions:", randomQuestions)

    res.json({ questions: randomQuestions.flat() });
  } catch (error) {
    console.error('Error fetching compatibility test:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.submitCompatibilityTest = async (req, res) => {
    try {
      const { userId, responses } = req.body;
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      user.compatibilityTest.responses = responses;
      user.compatibilityTest.completionStatus = true;
      await user.save();
  
      res.json({ message: 'Responses saved successfully' });
    } catch (error) {
      console.error('Error saving compatibility test responses:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  