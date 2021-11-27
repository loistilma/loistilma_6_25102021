const express = require('express')
const router = express.Router()
const upload = require('../middlewares/upload.middleware')

const { requireAuth, checkSauceAdmin } = require('../middlewares/auth.middleware')
const saucesController = require('../controllers/sauce.controller')

router.get('/', requireAuth, saucesController.get)
router.get('/:id', requireAuth, saucesController.getById)
router.post('/', requireAuth, upload, saucesController.create)
router.put('/:id', requireAuth, upload, saucesController.modify)
router.delete('/:id', requireAuth, saucesController.delete)
router.post('/:id/like', requireAuth, saucesController.setLike)

module.exports = router