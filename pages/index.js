import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import formatDate from '../utils/formatDate'
// TODO: why does require work here?
const cloudinary = require('cloudinary').v2

// import styles from '../styles/Home.module.css'

async function getPhotoAlbum(folderPath) {
  // console.log(`https://photo-album-six.vercel.app/api/album/${folderPath}`)
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
  }, [photoAlbumPaths])

  return (
    <div>
      <Head>
        <title>Photo Albums</title>
        <meta name="description" content="Photography by Jason Roundtree" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Photo Albums</h1>

        {/* <Link href='/photos'><a>Photos</a></Link> */}
        <ul>
          {photoAlbums.map(({ resources }) => {
            console.log(`resources: `, resources)
            // TODO: tag and query preview image directly
            if (resources.length) {
              const { context } = resources[0]
              
              return (
                <li key={resources[0].asset_id}>
                  <p>{context.display_location}</p>
                  <p>{formatDate(context.date)}</p>
                  <img 
                    src={resources[0].url}
                    alt={context.display_location}
                    width='300px'
                  />
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
  // console.log(`albumPaths: `, albumPaths)
  return {
    props: { albumPaths: albumPaths.folders }
  }
}