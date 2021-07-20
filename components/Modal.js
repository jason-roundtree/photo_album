import styled from 'styled-components'
// const AriaModal = require('react-aria-modal')

// TODO: why does pure-react-component remove this?
// const ImageContainer = styled.div`
//     /* max-height: 90vh; */
//     width: 100%;
//     display: flex;
//     justify-content: center;
//     align-content: center;
//     margin: 7px;
// `
const Image = styled.img`
    max-width: 90vw;
    height: auto;
    /* max-height: 80vh; */
    /* display: block; */
    /* margin: auto; */
    /* object-fit: contain; */
    /* height: ${props => props.height}; */
    /* width: ${props => props.width}; */
`

export default function Modal({ image, handleCloseImageModal }) {
    // console.log(`image: `, image)
    return (
        // TODO: render location and date somewhere in the modal?
        // <HeaderText id="title">{image.display_location}</HeaderText>
        // <HeaderText>{image.date}</HeaderText>
        // TODO: turn this div into React.Fragment if modal-wrapper remains unused
        <div id="modal-wrapper">
            <Image 
                src={image.url}
                alt={image.altText}
            />
        </div>
    )
}
