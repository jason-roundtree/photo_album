const cloudinary = require('cloudinary').v2
import { useState } from 'react'
import styled from 'styled-components'
import Modal from '../../../components/Modal'
import formatDate from '../../../utils/formatDate'

const AlbumContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0 2em;
`
const Image = styled.img`
    height: 300px;
    margin: 10px;
`

export default function AlbumName({ albumImages }) {
    const [modalImage, setModalImage] = useState({})
    const [modalIsActive, setModalIsActive] = useState(false)
    // console.log(`albumImages: `, albumImages)

    function handleLoadImageModal(imageData) {
        console.log(`imageData: `, imageData)
        setModalImage(imageData)
        setModalIsActive(true)
    }

    return (
        <>
            <h2>{albumImages[0].display_location}</h2>
            <h3>{formatDate(albumImages[0].date)}</h3>
            <AlbumContainer>
                {albumImages.map(({ url, date, display_location, id }) => {
                    const formattedDate = formatDate(date)
                    const altText = `Photo of ${display_location} on ${formattedDate}`
                    return (
                        <Image
                            src={url}
                            alt={altText}
                            key={id}
                            onClick={() => handleLoadImageModal({
                                date: formattedDate,
                                url,
                                display_location,
                                altText
                            })}
                        />
                    )
                })}
            </AlbumContainer>

            {modalIsActive 
                ? <Modal 
                    image={modalImage} 
                    setModalIsActive={setModalIsActive}
                />
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
    const albumImagesSerialized = albumImages.filter(image => {
        // TODO: Add test for when no context exists
        context = image?.context
        // console.log('image/context: ', image, '\n ---- \n', context)
        if (!context || context.isPrivate) return false
        return true
    }).map(filteredImage => {
        return {
            url: filteredImage.url,
            id: filteredImage.asset_id,
            display_location: context.display_location || '',
            date: context.date || '',
        }
    })

    return {
        props: { 
            albumImages: albumImagesSerialized
        }
    }
}