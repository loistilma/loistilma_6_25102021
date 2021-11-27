const Sauce = require('../models/sauce.model')
const file = require('../services/upload.service')
const { ErrorHandler } = require('../helpers/error.helper')

exports.get = async (req, res, next) => {
    try {
        const saucesFound = await Sauce.find()
        if (!saucesFound) throw new ErrorHandler(404, 'Erreur lors de la récupération des sauces')
        res.status(200).json(saucesFound)
    } catch (error) {
        next(error)
    }
}

exports.getById = async (req, res, next) => {
    try {
        const sauceFound = await Sauce.findOne({ _id: req.params.id })
        if (!sauceFound) throw new ErrorHandler(404, 'Erreur lors de la récupération de la sauce')
        res.status(200).json(sauceFound)
    } catch (error) {
        next(error)
    }
}

exports.create = async (req, res, next) => {
    const serverUrl = `${req.protocol}://${req.get('host')}/`
    try {
        const imagePath = serverUrl + req.file.path
        const newSauce = new Sauce({ ...JSON.parse(req.body.sauce), imageUrl: imagePath })
        await newSauce.save()
        res.status(201).json({ message: 'Sauce créée !' })
    } catch (error) {
        console.log(error)
        next(new ErrorHandler(400, 'Erreur lors de la création de la sauce'))
    }
}

exports.modify = async (req, res, next) => {
    const serverUrl = `${req.protocol}://${req.get('host')}/`

    try {
        var sauceObject = {}
        const sauceFound = await Sauce.findOne({ _id: req.params.id })
        if (req.currentUser !== sauceFound.userId) throw new ErrorHandler(401, 'Utilisateur invalide')
        if (req.file) {
            file.del(sauceFound.imageUrl)
            sauceObject = { ...JSON.parse(req.body.sauce), imageUrl: serverUrl + req.file.path }
        } else {
            sauceObject = { ...req.body }
        }
        await Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        res.status(200).json({ message: 'Sauce modifié !' })
    } catch (error) {
        next(error)
    }
}

exports.delete = async (req, res, next) => {
    try {
        const sauceFound = await Sauce.findOne({ _id: req.params.id })
        if (!sauceFound) throw new ErrorHandler(404, 'Erreur lors de la récupération de la sauce')
        if (req.currentUser !== sauceFound.userId) throw new ErrorHandler(401, 'Utilisateur invalide')
        file.del(sauceFound.imageUrl)
        await Sauce.deleteOne({ _id: req.params.id })
        res.status(200).json({ message: 'Sauce supprimé !' })

    } catch (error) {
        next(error)
    }
}

exports.setLike = async (req, res, next) => {
    try {
        const sauceFound = await Sauce.findOne({ _id: req.params.id })
        if (!sauceFound) throw new ErrorHandler(404, 'Erreur lors de la récupération de la sauce')
        const hasUserLiked = sauceFound.usersLiked.find(u => u === req.currentUser)
        const hasUserDisLiked = sauceFound.usersDisliked.find(u => u === req.currentUser)
        const likeHandler = () => {
            var decrement
            var pull
            if (hasUserLiked && (req.body.like === -1 || req.body.like === 0)) {
                decrement = { likes: -1 }
                pull = { $pull: { usersLiked: req.currentUser } }
            }
            if (hasUserDisLiked && (req.body.like === 1 || req.body.like === 0)) {
                decrement = { dislikes: -1 }
                pull = { $pull: { usersDisliked: req.currentUser } }
            }

            switch (req.body.like) {
                case -1:
                    if (hasUserDisLiked) return null
                    else return { $inc: { ...decrement, dislikes: 1 }, ...pull, $push: { usersDisliked: req.body.userId } }

                case 1:
                    if (hasUserLiked) return null
                    else return { $inc: { ...decrement, likes: 1 }, ...pull, $push: { usersLiked: req.body.userId } }

                case 0:
                    if (!hasUserLiked && !hasUserDisLiked) return null
                    return { $inc: { ...decrement }, ...pull }
            }
        }

        await Sauce.updateOne({ _id: req.params.id }, likeHandler())
        res.status(200).json({ message: 'Réaction modifié !' })

    } catch (error) {
        next(error)
    }
}