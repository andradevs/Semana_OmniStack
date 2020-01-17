const axios = require('axios')
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/ParseStringAsArray')
const { FindConnections,  sendMessage } = require('../websocket')

//index, show, store, update, destroy

module.exports = {
    async index(req,res){
        const devs = await Dev.find();
        return res.json(devs)
    },

    async store(req,res){
        const { github_username,techs,latitude,longitude } = req.body

        let dev = await Dev.findOne({ github_username });
        
        if(!dev){
            const response = await axios.get(`https://api.github.com/users/${github_username}`)
    
            const { name = login, avatar_url, bio} = response.data
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type:'Point',
                coordinates:[longitude,latitude]
            }
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            })

            // Filtrar as conexões que estão a no maximo de 10km de distancia
            // e que o novo dev tenha pelo menos uma das tecnologias filtradas
        
            const sendSocketMessageTo = FindConnections(
                {latitude,longitude},
                techsArray
            )
            // console.log(sendSocketMessageTo)
            sendMessage(sendSocketMessageTo, 'new-dev', dev)

        }
        
        
    
        return res.json(dev)
    },

    async update(req,res){
        const {latitude,longitude,techs} = req.body
        const github_username = req.params.id


        const response = await axios.get(`https://api.github.com/users/${github_username}`)

        const { name=login, bio, avatar_url } = (response.data)

        const techsArray = parseStringAsArray(techs)

        const location = {
            type:'Point',
            coordinates:[longitude,latitude]
        }

        const dev = await Dev.update({github_username: github_username},{
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
        })
        

        return res.json(dev)

    },

    async destroy(req,res){
        const github_username= req.params.id
        const dev = await Dev.deleteOne({github_username})

        return res.json(dev)
    }
}