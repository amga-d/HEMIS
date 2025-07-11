const router = require('express').Router();
const prisma = require('../services/prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* POST login*/

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'Username and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // delete the password
    const { password: _, ...userWithoutPassword } = user;
    const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60, // 1 hour
      path: '/',
      // Don't set domain for localhost to allow cross-port access
    });

    return res.status(200).json({
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* GET current user */
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: 'No authentication token' });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

/* POST logout */
router.post('/logout', (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
