import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styled from 'styled-components'
import formatDate from '../utils/formatDate'
// TODO: why does require work here?
const cloudinary = require('cloudinary').v2

const AlbumLocation = styled.p` color: rgb(255, 51, 126); `
const AlbumDate = styled.p` color: rgb(255, 219, 232); `

async function getPhotoAlbum(folderPath) {
  console.log(`https://photo-album-six.vercel.app/api/album/${folderPath}`)
  try {
    const res = await fetch(`https://photo-album-six.vercel.app/api/album/${folderPath}`)
    if (res.ok) {
      // console.log('getPhotoAlbum res: ', res)
      return res.json()
    } else {
      throw new Error(res)
    }
  } catch(err) {
    console.log(`error fetching ${folderPath} folder: `, err)
  }
}

export default function Home({ albumPaths }) {
  const [photoAlbumPaths, setPhotoAlbumPaths] = useState(albumPaths)
  const [photoAlbums, setPhotoAlbums] = useState([])
  console.log(`photoAlbumPaths: `, photoAlbumPaths)
  console.log(`photoAlbums: `, photoAlbums)

  useEffect(() => {
    // console.log(`useEffect`)
    const allPhotoAlbumPromises = photoAlbumPaths.map(({ path }) => {
      return getPhotoAlbum(path)
    })
    Promise.all(allPhotoAlbumPromises)
      .then(allPhotoAlbumData => {
        setPhotoAlbums(allPhotoAlbumData)

      })
      .catch(err => console.log('error resolving allPhotoAlbumPromises: ', err))
  }, [])

  return (
    <div>
      <Head>
        <title>Photo Albums</title>
        <meta name="description" content="Photography by Jason Roundtree" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Arimo:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <main>
        <h1>Photo Albums</h1>

        <ul>
          {photoAlbums.map(({ resources }) => {
            console.log(`resources: `, resources)
            // TODO: tag and query preview image directly
            if (resources.length) {
              const { context, asset_id, url, folder: folderPath } = resources[0]
              
              return (
                <li key={asset_id}>
                  <AlbumLocation>{context.display_location}</AlbumLocation>
                  <AlbumDate>{formatDate(context.date)}</AlbumDate>
                  
                  <Link href={`/album/${folderPath}`}>
                    <a>
                      <img 
                        src={url}
                        alt={context.display_location}
                        width='400px'
                      />
                    </a>
                  </Link>
                </li>
              )
            }
          })}
        </ul>
      </main>

      <footer>
        {/* <a
          target="_blank"
          rel="noopener noreferrer"
        >
        </a> */}
      </footer>
    </div>
  )
}

// export async function getStaticPaths() {
//   const res = await fetch('https://photo-album-six.vercel.app/api/albumPaths')
//   console.log(`res: `, res)
//   const albumPaths = await res.json()
//   const paths
// }

// TODO: tag and query preview image directly
export async function getStaticProps() {
  const albumPaths = await cloudinary
    .api
    .sub_folders('outdoors', (err, res) => {
      if (!err) {
        console.log('get folders res: ', res)
        return res
      } else {
        console.log('error fetching subfolders: ', err)
      }
    })
  // const res = await fetch('https://photo-album-six.vercel.app/api/paths')
  // const a = await res.text()
  // console.log(`res: `, res)
  // const albumPaths = await res.json()
  console.log(`albumPaths: `, albumPaths)
  return {
    props: { albumPaths: albumPaths.folders }
  }
}