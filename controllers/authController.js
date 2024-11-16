const bcrypt = require('bcrypt');
const otplib = require('otplib');
const User = require('../models/user');
const { sendWelcomeEmail, sendAlarmNotification} = require('../utility/email-sender');
const QRCode = require('qrcode');

exports.signup = async (req, res) => {
    const { username, password, firstName, lastName, age, gender, email } = req.body;
  
    const user = await User.findOne({ username });
    if (user) return res.status(404).json({ message: 'User already exists.' });

    if(await User.findOne({email})){
        return res.status(400).json({message: 'Email already exists'});
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
   
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        age,
        gender,
        email,
      });
      await newUser.save();
      
      sendWelcomeEmail(email, lastName);
      return res.status(201).json({message: "Registration success"});
    } catch (error) {
      return res.status(500).json({ message: 'Registration failed.' });
    }
  };
  

exports.setup2FA = async (req, res) => {
  
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if(user.secret){
      return res.status(409).json({message: '2FA already enabled'});
    }
    let secret = otplib.authenticator.generateSecret();

    user.secret = secret;
    await user.save();
    const otpauth = otplib.authenticator.keyuri(user.username, 'PortfolioPlatform', secret);

    QRCode.toDataURL(otpauth, (err, qrCodeUrl) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to generate QR code.' });
      }

      res.json({
        qrCodeUrl,
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to setup 2FA.' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    
    if (!req.session.attempts) {
      req.session.attempts = {};
    }

    const userAttempts = req.session.attempts[username] || { count: 0 };

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      userAttempts.count += 1;
      req.session.attempts[username] = userAttempts;

      if (userAttempts.count === 3) {
        sendAlarmNotification(user.email);
      }
      
      return res.status(401).json({ message: 'Invalid password.' });
    }

    req.session.attempts[username] = { count: 0 };

    req.session.user = {
      userId: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      gender: user.gender,
      role: user.role,
    };
    if(!user.secret){
      res.json({ isEnabled: false, message: "Logged in successfully!" });
    } else{
      res.json({ isEnabled: true, message: "Logged in successfully!" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Login failed.' });
  }
};



exports.verifyOTP = async (req, res) => {
  const { token } = req.body;
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (!req.session.failedOTPAttempts) {
      req.session.failedOTPAttempts = {};
    }

    const userOTPAttempts = req.session.failedOTPAttempts[username] || { count: 0, lastFailedLogin: null };


    const isTokenValid = otplib.authenticator.verify({ token, secret: user.secret });
    if (!isTokenValid) {
      userOTPAttempts.count += 1;
      userOTPAttempts.lastFailedLogin = new Date();
      req.session.failedOTPAttempts[username] = userOTPAttempts;

      if (userOTPAttempts.count === 3) {
        sendAlarmNotification(user.email);
      }

      return res.status(401).json({ message: 'Invalid 2FA code.' });
    }

    req.session.failedOTPAttempts[username] = { count: 0, lastFailedLogin: null };

    req.session.user = {
      userId: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      gender: user.gender,
      role: user.role,
    };

    res.json({ success: true, message: "OTP verified successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to verify OTP.' });
  }
};

  
exports.logout = async(req, res) => {
    req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to log out.' });
        }

        res.clearCookie('connect.sid'); 
        res.redirect('/');
    });
}

exports.skip = async (req, res) => {
  const { username } = req.params;

  try {
      const user = await User.findOneAndUpdate(
          { username: username },
          { $set: { secret: null } }, 
          { new: true }  
      );

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      return res.json({ message: '2FA setup skipped', user });
  } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
  }
};
