import styled from 'styled-components'
const AriaModal = require('react-aria-modal')

// const HeaderText = styled.p` color: white; `
const ImageContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    /* position: relative; */
`
const Image = styled.img`
    height: auto;
    max-height: 90vh;
    max-width: 90vw;
    /* display: block; */
    /* margin: auto; */
    /* object-fit: contain; */
    /* height: ${props => props.height}; */
    /* width: ${props => props.width}; */
`

// TODO: add an X/Close icon
// TODO: Fix titleText and initialFocus if implemented and also check out other props that can be passed
export default function Modal({ image, handleCloseImageModal }) {
    // console.log(`image: `, image)
    return (
        <AriaModal
            titleText="hi"
            initialFocus="#modal-wrapper"
            // TODO: clear activeModalImage too:
            onExit={handleCloseImageModal}
            underlayStyle={{ 
                background: 'rgba(0, 0, 0, 0.9)',
                paddingTop: '2em' 
            }}
        >   
            {/* TODO: render location and date somewhere in the modal? */}
            {/* <HeaderText id="title">{image.display_location}</HeaderText>
            <HeaderText>{image.date}</HeaderText> */}
            <ImageContainer id="modal-wrapper">
                <Image 
                    src={image.url}
                    alt={image.altText}
                    // width={image.width}
                    // height={image.height}
                />
                {/* TODO: Why is using next/image so much slower when it's supposed to optimize? */}
                {/* <NextImage 
                    src={image.url}
                    alt={image.altText}
                    width={image.width}
                    height={image.height}
                    layout='intrinsic'
                /> */}
            </ImageContainer>
            
        </AriaModal>
    )
}
