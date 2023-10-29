
const router = require('express').Router();
const { User, Tasks } = require('../models');
const withAuth = require('../utils/auth');

router.get('/mytasks', withAuth, async (req, res) => {
    try {
      const tasksData = await Tasks.findAll({
        include: [
          {
            model: User,
            attributes: ['username'],
          },
        ],
      });
      // Serialize data so the template can read it
       const tasks = tasksData.map((task) => task.get({ plain: true }));
  
      // Pass serialized data and session flag into template
      res.render('mytasks', { 
        tasks, 
        logged_in: req.session.logged_in 
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });


// Prevent non logged in users from viewing the homepage
router.get('/', withAuth, async (req, res) => {
    try {
      const userData = await User.findAll({
        attributes: { exclude: ['password'] },
        order: [['username', 'ASC']],
      });
  
      const users = userData.map((project) => project.get({ plain: true }));
  
      res.render('homepage', {
        users,
        // Pass the logged in flag to the template
        logged_in: req.session.logged_in,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get('/login', (req, res) => {
    // If a session exists, redirect the request to the homepage
    if (req.session.logged_in) {
      res.redirect('/');
      return;
    }
  
    res.render('login');
  });
  
  module.exports = router;

