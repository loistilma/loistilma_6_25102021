const express = require('express')
const router = express.Router()
const upload = require('../middlewares/upload.middleware')

const { requireAuth, checkSauceAdmin } = require('../middlewares/auth.middleware')
const saucesController = require('../controllers/sauce.controller')

router.get('/', requireAuth, saucesController.get)
router.get('/:id', requireAuth, saucesController.getById)
router.post('/', requireAuth, upload, saucesController.create)
router.put('/:id', requireAuth, checkSauceAdmin, upload, saucesController.modify)
router.delete('/:id', requireAuth, checkSauceAdmin, saucesController.delete)
router.post('/:id/like', requireAuth, saucesController.setLike)

module.exports = router