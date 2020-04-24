const router = require('express').Router();


const Users = require('./users-model.js');

router.get('/', (req, res) => {
  Users.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => res.send(err));
});
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Users.findById(id)
    .then((project) => {
      if (!project === []) {
        res.status(404).json({ message: 'Could not find project with given id.' });
      } else {
        res.status(200).json(project);
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'Failed to get project', error: err });
    });
});
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  Users.remove(id)
    .then((deleted) => {
      if (deleted) {
        res.json({ removed: deleted });
      } else {
        res.status(404).json({ message: 'Could not find project with given id' });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'Failed to delete project' });
    });
});

module.exports = router;
