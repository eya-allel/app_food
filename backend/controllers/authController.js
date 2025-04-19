const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // On va générer un JWT pour la session utilisateur

// Fonction pour l'inscription
exports.register = async (req, res) => {
  try {
    const { username, phone, password, role, businessName, businessAddress } = req.body;

    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone already registered.' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = new User({
      username,
      phone,
      password: hashedPassword,
      role,
      businessName: role === 'caterer' ? businessName : undefined,
      businessAddress: role === 'caterer' ? businessAddress : undefined
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!', user: newUser });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Fonction pour la connexion
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: 'Invalid phone or password.' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid phone or password.' });
    }

    // Créer un token JWT
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        username: user.username,
        phone: user.phone,
        role: user.role,
        businessName: user.businessName,
        businessAddress: user.businessAddress
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
