import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
// import styles from '../styles/Home.module.css'

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
    const allPhotoAlbumPromises = photoAlbumPaths.map(({ path }) => {
      getPhotoAlbum(path)
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

export async function getStaticProps() {
  const res = await fetch('https://photo-album-six.vercel.app/api/paths')
  // const a = await res.text()
  // console.log(`res.json(): `, a)
  const albumPaths = await res.json()
  console.log(`albumPaths: `, albumPaths)
  return {
    props: { albumPaths: albumPaths.folders }
  }
}