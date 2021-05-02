const cloudinary = require('cloudinary').v2

export default (req, res) => {
    // console.log('req', req)
    cloudinary
        .search
        .expression(`${req.query.collection}/${req.query.name}/*`)
        .with_field('context')
        .execute()
        .then(result => {
            // console.log('folder path result: ', result)
            res.json(result) 
        })
}