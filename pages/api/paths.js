const cloudinary = require('cloudinary').v2

export default (req, res) => {
    console.log(`zz req: `, req)
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
}