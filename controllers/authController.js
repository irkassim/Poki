const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const getZodiacSign = require('../utils/zodiacs')
const mongoose = require('mongoose')
mongoose.set('debug', true);


// User Registration
exports.signup = async (req, res) => {
 
  //console.log(req.body)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password,  firstName, lastName, dateOfBirth,location } = req.body;

  /*   const userLocation = location || {
      type: "Point",
      coordinates: [0, 0] // Default coordinates
    }; */
   
    // Check if the email or username already exists
    //const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    const existingUser = await User.findOne( { email } );
    if (existingUser) {
      return res.status(400).json({ error: 'Email or Username already exists' });

    }
    console.log('Signup Request Body:', req.body);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine the user's zodiac sign
    const userZodiac = getZodiacSign(new Date(dateOfBirth)); // 

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      dateOfBirth,
      location,
      zodiacSigns: [userZodiac], // Save the user's zodiac sign
    });

    //console.log( newUser)

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//Login Controller
exports.login = async (req, res) => {
  try {
    console.log('Login route hit'); // Log to ensure the route is reached
    const { email, password } = req.body;
    //console.log(req.body)

    //console.log('Request body:', req.body); // Check incoming data

    // Check if the user exists
    const user = await User.findOne({ email });
   // console.log('User found:', user);

     if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
     }

     // Verify the password
     const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    } 

    /* // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' }); */
     // Generate tokens
     const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5hr' });
     const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
 
     // Save the refresh token securely (e.g., in a database or Redis)
     user.refreshToken = refreshToken;
     //await user.save();
     try {
      //await user.save();
      const savedUser = await user.save();
        console.log('Saved user:', savedUser);
    } catch (error) {
      console.error('Error saving refresh token:', error.message);
    }
 
     // Send tokens
    // res.json({ accessToken, refreshToken });
    res.status(200).json({
      message: 'Login successful!',
      token:{ accessToken, refreshToken },
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        isProfileComplete: user.isProfileComplete, 
      },
    });
  } catch (error) {
    console.error('Login error:', error.message); // Log the actual error
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
