import styled from 'styled-components'
const cloudinary = require('cloudinary').v2

export default function AlbumName(props) {
    console.log(`props: `, props)
    return (
        <h2>Album: {props.albumName}</h2>
    )
}

async function getPhotoAlbum(collection, name) {
    const album = await cloudinary
        .search
        .expression(`${collection}/${name}/*`)
        .with_field('context')
        .execute()
        .then(result => {
            // console.log('folder path result: ', result)
            return result
        })
        .catch(err => console.log('error: ', err))
    
    console.log(`album: `, album)
    return album
    // console.log(`https://photo-album-six.vercel.app/api/album/${folderPath}`)
    // try {
    //     const res = await fetch(`https://photo-album-six.vercel.app/api/album/${collection}/${name}`)
    //     if (res.ok) {
    //         // console.log('getPhotoAlbum res: ', res)
    //         return res.json()
    //     } else {
    //         throw new Error(res)
    //     }
    // } catch(err) {
    //     console.log(`error fetching ${collection}/${name} folder: `, err)
    // }
}

async function getAlbumPaths() {
    const { folders: albumPaths } = await cloudinary
        .api
        .sub_folders('outdoors', (err, res) => {
            if (!err) {
                console.log('get folders res: ', res)
                return res
            } else {
                console.log('error fetching subfolders: ', err)
            }
        })
    return albumPaths
}

export async function getStaticPaths() {
    const albumNameAndPath = await getAlbumPaths()
    console.log(`albumNameAndPath: `, albumNameAndPath)
    const pathData = albumNameAndPath.map(({ name, path }) => {
        return {
            params: {
                albumCollection: path.split('/')[0],
                albumName: name
            }
        }
    })
    return { 
        paths: pathData,
        fallback: false 
    }
}
  
export async function getStaticProps({ params: { albumCollection, albumName } }) {
    // console.log(`getStaticProps params: `, params)
    const albumData = await getPhotoAlbum(albumCollection, albumName) 
    console.log(`albumData: `, albumData)
    return {
        props: { 
            albumData,
            // TODO: extract album name from `resources` instead of this name/id
            albumName
        }
    }
}