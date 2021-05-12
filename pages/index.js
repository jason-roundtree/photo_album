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

export default function Home({ albumData }) {
  // const [photoAlbumPaths, setPhotoAlbumPaths] = useState(albumPaths)
  const [photoAlbums, setPhotoAlbums] = useState(albumData)
  // console.log(`photoAlbumPaths: `, photoAlbumPaths)
  // console.log(`photoAlbums: `, photoAlbums)

  // useEffect(() => {
  //   // console.log(`useEffect`)
  // }, [])

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
            // console.log(`resources: `, resources)
            // TODO: tag and query preview image directly
            if (resources.length) {
              const { 
                context = '', 
                folder: folderPath,
                asset_id, 
                url, 
              } = resources[0]
              
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

async function getPhotoAlbum(collection, name) {
  console.log('getPhotoAlbum: ', `${collection}/${name}`)
  const album = await cloudinary
    .search
    .expression(`${collection}/${name}/*`)
    .with_field('context')
    .execute()
    .then(result => {
        // console.log('getPhotoAlbum return')
        return result
    })
    .catch(err => console.log('error: ', err))
    // console.log(`album index.js`)
    // console.log(`album index.js: `, album.resources[0])

  return album
}

// TODO: tag and query preview image directly
export async function getStaticProps() {
  const { folders: albumPaths } = await cloudinary
    .api
    .sub_folders('outdoors', (err, res) => {
      if (!err) {
        console.log('folers res: ', res)
        return res
      } else {
        console.log('error fetching subfolders: ', err)
      }
    })
  // console.log(`albumPaths: `, albumPaths)
  // console.log(`albumPaths`)
  // TODO: is Promise.all needed here?
  const albumData = await Promise.all(
    albumPaths.map(({ name, path }) => {
      const collection = path.split('/')[0]
      return getPhotoAlbum(collection, name)
    }))
    .then(data => {
      // console.log('dataaaa: ', data)
      // console.log('dataaaa')
      return data
    })
    .catch(err => console.log('Error fetching photo album from getStaticProps: ', err))
  // console.log(`getStaticProps albumData: `, albumData)
  // console.log(`getStaticProps albumData`)
  
  const serializedAlbumData = albumData.map(({ resources }) => {
    // const serializedAlbumData = albumData.map(album => {
    console.log(`resources[0]: `, resources[0])
    // const resources = album.resources
    let folderPath = resources[0].folder
    let date = resources[0]?.context?.date
    return {
      folderPath: folderPath || '',
      date: date || '',
      resources: resources
    }
  })
  // console.log(`serializedAlbumData: `, serializedAlbumData)

  return {
    props: { 
      albumData: serializedAlbumData
    }
  }
}