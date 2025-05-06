const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

// Middleware pour protéger les routes (vérification du token)
exports.protect = async (req, res, next) => {
  try {
    // 1) Vérifier si le token est présent
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Vous n\'êtes pas connecté. Veuillez vous connecter pour accéder à cette ressource.'
      });
    }

    // 2) Vérification du token
    const decoded = jwt.verify(token, 'your-secret-key');

    // 3) Vérifier si l'utilisateur existe toujours
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'L\'utilisateur associé à ce token n\'existe plus.'
      });
    }

    // Ajouter l'utilisateur à l'objet request
    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Token invalide ou expiré'
    });
  }
};

// Middleware pour restreindre l'accès selon le rôle
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Vérifie si le rôle de l'utilisateur est inclus dans les rôles autorisés
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'Vous n\'avez pas la permission d\'effectuer cette action'
      });
    }
    next();
  };
};