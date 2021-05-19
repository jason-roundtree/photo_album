import styled from 'styled-components'
const AriaModal = require('react-aria-modal')

const HeaderText = styled.p` color: white; `
const Image = styled.img`
    height: 550px;
`

export default function Modal({ image, setModalIsActive }) {
    // console.log(`image: `, image)
    return (
        <AriaModal
            titleText="hi"
            initialFocus="#title"
            onExit={() => setModalIsActive(false)}
            underlayStyle={{ 
                background: 'rgba(0, 0, 0, 0.9)',
                paddingTop: '3em' 
            }}
        >
            <HeaderText id="title">{image.display_location}</HeaderText>
            <HeaderText>{image.date}</HeaderText>
            <Image 
                src={image.url}
                alt={image.altText}
            />
        </AriaModal>
    )
}
