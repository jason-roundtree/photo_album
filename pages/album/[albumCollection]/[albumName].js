const cloudinary = require('cloudinary').v2
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { CarouselProvider, Slider, Slide, Image as PRC_Image, ButtonBack, ButtonNext, Dot } from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css'
import Gallery from 'react-photo-gallery'
import formatDate from '../../../utils/formatDate'

// TODO: Why can't I use the 'Styling Any Component' method from Styled Components docs to style pure-react-carousel's components? 

// const ChangeSlideButtonWrapper = styled.span`
//     & button {
//         font-size: 1.2em;
//         padding: 10px;
//         border: none;
//     }
// `
const CloseCarouselBtn = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    margin: 5px;
    padding: 1px 5px;
    font-size: 1.25em;
    opacity: .5;
    background: none;
    border: none;
    /* TODO: change back to black (ie no color) when you fix carousel buttons to be positioned relative to image width */
    color: azure;
    &:hover {
        cursor: pointer;
        background: rgb(11, 18, 11);
        color: azure;
    }
`

export default function AlbumName({ albumImages }) {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(null)
    const [carouselIsActive, setCarouselIsActive] = useState(false)
    // console.log(`albumImages: `, albumImages)

    function handleOpenCarousel(e, imgData) {
        setCurrentSlideIndex(imgData.index)
        setCarouselIsActive(true)
        document.body.style.overflow = 'hidden'
    }

    function handleCloseCarousel() {
        setCurrentSlideIndex(null)
        setCarouselIsActive(false)
        document.body.style.overflow = 'initial'
    }

    return (
        <>
            <h2>{albumImages[0].display_location}</h2>
            <h3>{formatDate(albumImages[0].date).toDateString()}</h3>
            <Gallery 
                photos={albumImages} 
                margin={4}
                onClick={handleOpenCarousel}
            />

            {carouselIsActive 
                ? (
                    <div className='carousel-overlay'>
                        <CarouselProvider
                            naturalSlideWidth={75}
                            naturalSlideHeight={50}
                            totalSlides={albumImages.length}
                            currentSlide={currentSlideIndex}
                            className='carousel-provider'
                        >
                            <Slider>
                                {albumImages.map((img, i) => {
                                    return (
                                        <Slide key={img.id} className='slide'>
                                            <PRC_Image 
                                                src={img.src} 
                                                alt={img.altText}
                                                index={i}
                                                id={img.id}
                                                className='slideImage'
                                            />
                                        </Slide>
                                    )
                                })}
                            </Slider>
                            
                            <div className='carousel-nav-btn-container'>
                                <ButtonBack className='prev'>&#8678;</ButtonBack>
                                <ButtonNext className='next'>&#8680;</ButtonNext>
                            </div>

                            <CloseCarouselBtn onClick={handleCloseCarousel}>
                                &#215;
                            </CloseCarouselBtn>
                        </CarouselProvider>
                    </div>
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
        // TODO: implement cursor for when max_results is more than 100?
        .max_results(100)
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
    console.log(`albumImages.length: `, albumImages.length)
    const baseImageUrl = 'http://res.cloudinary.com/daeedgezj/image/upload'
    const albumImagesSerialized = albumImages
        .filter(image => {
            const context = image?.context
            if ( !context || context.isPrivate) {
                return false
            }
            return true
        })
        .map(image => {
            const { context } = image
            // const lqipUrl = cloudinary.url(image.public_id, {transformation: [
            //     {quality: "auto", fetch_format: "auto"},
            //     {effect: "blur:700", quality: 1},
            //     {effect: "cartoonify"}
            // ]})

            const baseImageOptimized = `${baseImageUrl}/f_auto/q_auto/w_auto`
            const imagePathAndFormat = `${image.folder}/${image.filename}.${image.format}` 
            const fullImageUrl = `${baseImageOptimized}/${imagePathAndFormat}`
            // const lqipImageUrl = `${baseImageOptimized}/e_blur:1500,q_1/e_cartoonify/${imagePathAndFormat}`
            
            // const date = context.date ? context.date : null
            const date = context.date
            // NOTE: If you toggle lqip image or otherwise change the order of these properties you must also change the order of destructioning inside of the `handleOpenImageModal` function above
            return {
                src: fullImageUrl,
                // lqip_src: lqipUrl,
                id: image.asset_id,
                display_location: context.display_location || '',
                date: date,
                width: image.width,
                height: image.height,
                alt: `Photo of ${context.display_location} on ${date}`
            }
        })

    return {
        props: { 
            albumImages: albumImagesSerialized
        }
    }
}