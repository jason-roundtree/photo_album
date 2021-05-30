const cloudinary = require('cloudinary').v2
import { useState } from 'react'
import styled from 'styled-components'
import Gallery from 'react-photo-gallery'
import Modal from '../../../components/Modal'
import formatDate from '../../../utils/formatDate'

// const AlbumContainer = styled.div`
//     display: flex;
//     flex-wrap: wrap;
//     justify-content: center;
//     padding: 0 2em;
// `
// const Image = styled.img`
//     height: 300px;
//     margin: 10px;
// `

export default function AlbumName({ albumImages }) {
    const [modalImage, setModalImage] = useState({})
    const [modalIsActive, setModalIsActive] = useState(false)
    // console.log(`albumImages: `, albumImages)

    function handleOpenImageModal(e) {
        // TODO: change how these values are being extracted so it doesn't rely on order
        const [ 
            src, id, display_location, date, width, height, 
        ] = Array.from(e.target.attributes)
        const _display_location = display_location.nodeValue
        const formattedDate = formatDate(date.nodeValue)

        const imageData = {
            url: src.nodeValue,
            id: id.nodeValue,
            display_location: _display_location,
            date: formattedDate,
            width: width.nodeValue,
            height: height.nodeValue,
            altText: `Photo of ${_display_location} on ${formattedDate}`
        }

        setModalImage(imageData)
        setModalIsActive(true)
    }

    function handleCloseImageModal() {
        setModalImage({})
        setModalIsActive(false)
    }

    return (
        <>
            <h2>{albumImages[0].display_location}</h2>
            <h3>{formatDate(albumImages[0].date)}</h3>
            <Gallery 
                photos={albumImages} 
                margin={4}
                onClick={handleOpenImageModal}
            />

            {modalIsActive 
                ? (
                    <Modal 
                        image={modalImage} 
                        handleCloseImageModal={handleCloseImageModal}
                    />
                )
                : ''
            }
        </>
    )
}

async function getPhotoAlbum(collection, name) {
    const album = await cloudinary
        .search
        .expression(`${collection}/${name}/*`)
        .with_field('context')
        .execute()
        .then(result => {
            return result
        })
        .catch(err => console.log('error: ', err))
    
    return album
}

async function getAlbumPaths() {
    const { folders: albumPaths } = await cloudinary
        .api
        .sub_folders('outdoors', (err, res) => {
            if (!err) {
                // console.log('get folders res: ', res)
                return res
            } else {
                console.log('error fetching subfolders: ', err)
            }
        })

    return albumPaths
}

export async function getStaticPaths() {
    const albumNameAndPath = await getAlbumPaths()
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
    const { resources: albumImages } = await getPhotoAlbum(albumCollection, albumName) 
    let context
    const baseImageUrl = 'http://res.cloudinary.com/daeedgezj/image/upload'
    const albumImagesSerialized = albumImages
        .filter(image => {
            // TODO: Add test for when no context exists
            context = image?.context
            if (!context || context.isPrivate) return false
            return true
        })
        .map(image => {
            // console.log(`image: `, image)

            // const lqipUrl = cloudinary.url(image.public_id, {transformation: [
            //     {quality: "auto", fetch_format: "auto"},
            //     {effect: "blur:700", quality: 1},
            //     {effect: "cartoonify"}
            // ]})

            const baseImageOptimized = `${baseImageUrl}/f_auto/q_auto/w_auto`
            const imagePathAndFormat = `${image.folder}/${image.filename}.${image.format}` 
            const fullImageUrl = `${baseImageOptimized}/${imagePathAndFormat}`
            // const lqipImageUrl = `${baseImageOptimized}/e_blur:1500,q_1/e_cartoonify/${imagePathAndFormat}`
     
            // NOTE: If you toggle lqip image or otherwise change the order of these properties you must also change the order of destructioning inside of the `handleOpenImageModal` function above
            return {
                src: fullImageUrl,
                // lqip_src: lqipUrl,
                id: image.asset_id,
                display_location: context.display_location || '',
                date: context.date || '',
                width: image.width,
                height: image.height
            }
        })

    return {
        props: { 
            albumImages: albumImagesSerialized
        }
    }
}