const cloudinary = require('cloudinary').v2
import Cors from 'cors'
import initMiddleware from '../../../../utils/init-middleware'

const cors = initMiddleware(
    // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
    Cors({
        // Only allow requests with GET, POST and OPTIONS
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function handler(req, res) {
    console.log('req', req)
    await cors(req, res)

    cloudinary
        .search
        .expression(`${req.query.albumCollection}/${req.query.albumName}/*`)
        .with_field('context')
        .execute()
        .then(result => {
            // console.log('folder path result: ', result)
            res.json(result) 
        })
        .catch(err => console.log('error: ', err))
}