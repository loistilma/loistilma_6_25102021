const Sauce = require('../models/sauce.model')
const file = require('../services/upload.service')
const user = require ('../services/auth.service')

exports.get = async (req, res, next) => {
    try{
        const saucesFound = await Sauce.find()
        res.status(200).json(saucesFound)
    } catch(e) {
        res.status(400).json({ message: e })
    }
}

exports.getById = async (req, res, next) => {
    try{
        const sauceFound = await Sauce.findOne({ _id: req.params.id })
        res.status(200).json(sauceFound)
    } catch(e) {
        res.status(404).json({ message: e })
    }
}

exports.create = async (req, res, next) => {
    const serverUrl = `${req.protocol}://${req.get('host')}/`
    const imagePath = serverUrl + req.file.path

    const newSauce = new Sauce({...JSON.parse(req.body.sauce), imageUrl: imagePath})
    await newSauce.save()
    res.status(201).json({ message: 'Sauce créée !'})

}

exports.modify = async (req, res, next) => {
    const serverUrl = `${req.protocol}://${req.get('host')}/`
    var sauceObject = {}

    if(req.file){
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                file.del(sauce.imageUrl)
            })
        sauceObject = { ...JSON.parse(req.body.sauce), imageUrl: serverUrl + req.file.path }
    }else{
        sauceObject = { ...req.body.sauce }
    }

    try{
        await Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        res.status(200).json({ message: 'Sauce modifié !'})
    } catch(e) {
        res.status(400).json({ message: e })
    }
}

exports.delete = async (req, res, next) => {

        Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            file.del(sauce.imageUrl)
        })
        Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
            .catch(error => res.status(400).json({ error }))

}

exports.setLike = async(req, res, next) => {

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const hasUserLiked = sauce.usersLiked.find(u => u === user.extractUserId(req) )
            const hasUserDisLiked = sauce.usersDisliked.find(u => u === user.extractUserId(req) )
            const likeHandler = () => {
                var decrement
                var pull
                if (hasUserLiked && (req.body.like === -1 || req.body.like === 0)) {
                    decrement = { likes: -1 }
                    pull = { $pull: { usersLiked: req.body.userId } }
                }
                if (hasUserDisLiked && (req.body.like === 1 || req.body.like === 0)) {
                    decrement = { dislikes: -1 }
                    pull =  { $pull: { usersDisliked: req.body.userId } }
                }
                //console.log(decrement)
                switch (req.body.like) {
                    case -1 : 
                        if(hasUserDisLiked) return null
                        else return {$inc: {...decrement, dislikes: 1}, ...pull, $push: { usersDisliked: req.body.userId }}
                    
                    case 1 : 
                        if(hasUserLiked) return null
                        else return {$inc: {...decrement, likes: 1}, ...pull, $push: { usersLiked: req.body.userId }}

                    case 0 : 
                        if(!hasUserLiked && !hasUserDisLiked) return null
                        return {$inc: {...decrement}, ...pull}
                }
            }
            //console.log(likeHandler())
            
            Sauce.updateOne({ _id: req.params.id }, likeHandler() )
            .then(() => res.status(200).json({ message: 'Réaction modifié !'}))
            .catch(error => res.status(400).json({ error }))
            
        })
}