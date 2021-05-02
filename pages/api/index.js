require('dotenv').config()
const cloudinary = require('cloudinary').v2
const app = require('express')()
const cors = require('cors')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get('/api/folders', (req, res) => {
    console.log('get folders')
    cloudinary
        .api
        .sub_folders('outdoors', (err, _res) => {
            if (!err) {
                // console.log('get folders _res: ', _res)
                res.json(_res)
            } else {
                console.log('error fetching subfolders: ', err)
            }
        })
})

app.get('/album/:category/:name', (req, res) => {
    console.log('/album/:category/:name params.name', req.params.name)
    cloudinary
        .search
        .expression(`${req.params.category}/${req.params.name}/*`)
        .with_field('context')
        .execute()
        .then(result => {
            // console.log('folder path result: ', result)
            res.json(result) 
        })
})

// app.get('/photos', (req, res) => {
//     console.log('get photos')
//     cloudinary
//         .search
//         .with_field('context')
//         .max_results()
//         .execute()
//         .then(result => {
//             // console.log('photos: ', result)
//             res.json(result) 
//         })
//         .catch(err => console.log('error: ', err))
// })

// const server = app.listen(process.env.PORT || 9000, () => {
//     console.log('Listening on port %d', server.address().port)
// })

module.exports = app