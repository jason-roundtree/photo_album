const cloudinary = require('cloudinary').v2
import styled from 'styled-components'
import formatDate from '../../../utils/formatDate'

const FlexContainer = styled.div`
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
    // console.log(`albumImages: `, albumImages)
    return (
        <>
            <h2>{albumImages[0].display_location}</h2>
            <h3>{formatDate(albumImages[0].date)}</h3>
            <FlexContainer>
                {albumImages.map(image => {
                    return (
                        <Image
                            src={image.url}
                            alt={`Photo of ${image.display_location} on ${image.date}`}
                            key={image.id}
                        />
                    )
                })}
            </FlexContainer>
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
        console.log('image: ', image)
        context = image?.context
        if (context.isPrivate) {
            return false
        }
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