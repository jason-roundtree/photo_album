import styled from 'styled-components'
const cloudinary = require('cloudinary').v2
import formatDate from '../../../utils/formatDate'

const GridContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`
const Image = styled.img`

`

export default function AlbumName(props) {
    console.log(`props: `, props)
    return (
        <>
            <h2>{props.albumImages[0].display_location}</h2>
            <h3>{formatDate(props.albumImages[0].date)}</h3>
            <GridContainer>
                {/* <ul> */}
                    {props.albumImages.map(image => {
                        return (
                            <Image
                                src={image.url}
                                alt={`
                                    Photo of ${image.display_location} on ${image.date}
                                `}
                                width='400px'
                            />
                        )
                    })}
                {/* </ul> */}
            </GridContainer>
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
            console.log('folder path result: ', result)
            return result
        })
        .catch(err => console.log('error: ', err))
    
    // console.log(`album: `, album)
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
    // console.log(`getStaticProps albumCollection/albumName: `, albumCollection, albumName)
    const { resources: albumImages } = await getPhotoAlbum(albumCollection, albumName) 
    console.log(`albumImages: `, albumImages)
    const albumImagesSerialized = albumImages.map(image => {
        const context = image?.context
        return {
            url: image.url,
            id: image.asset_id,
            display_location: context.display_location,
            date: context.date
        }
    })
    return {
        props: { 
            albumImages: albumImagesSerialized
        }
    }
}