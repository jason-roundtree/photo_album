import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styled from 'styled-components'
import formatDate from '../utils/formatDate'
// TODO: which package should i be using? the commented out line below was working until adding 
// const cloudinary = require('cloudinary').v2
const cloudinary = require('cloudinary/lib/cloudinary').v2

const AlbumLocation = styled.p` color: rgb(255, 51, 126); `
const AlbumDate = styled.p` color: rgb(255, 219, 232); `

export default function Home({ previewData }) {
  const [photoAlbumPreviews, setPhotoAlbumPreviews] = useState(previewData)

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
          {photoAlbumPreviews.map(({ resources }) => {
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
    .then(res => {
        // console.log('getPhotoAlbum return')
        return res
    })
    .catch(err => console.log('error querying for photo album: ', err))
    // console.log(`album index.js`)
    // console.log(`album index.js: `, album.resources[0])

  return album
}

async function getPreviewImage(collection, name) {
  console.log('getPreviewImage: ', `${collection}/${name}`)
  const previewImageData = await cloudinary
    .search
    .expression(`
        ${collection}/${name}/*
        AND
        context:preview_image
    `)
    .with_field('context')
    .execute()
    .then(data => {
        console.log('getPreviewImage data: ', data)
        return data
    })
    .catch(err => console.log('error querying for preview image: ', err))
  return previewImageData
}

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
  const albumsPreviewData = await Promise.all(
    albumPaths.map(({ name, path }) => {
      const collection = path.split('/')[0]
      // return getPhotoAlbum(collection, name)
      return getPreviewImage(collection, name)
    }))
    .then(data => {
      console.log('preview image data: ', data)
      // console.log('dataaaa')
      return data
    })
    .catch(err => console.log('Error fetching photo album from getStaticProps: ', err))
  // console.log(`getStaticProps albumData: `, albumData)
  // console.log(`getStaticProps albumData`)
  const serializedPreviewData = []
  albumsPreviewData.forEach(({ resources }) => {
    // console.log(`resources[0]: `, resources[0])
    if (resources[0]) {
      let folderPath = resources[0].folder
      let date = resources[0]?.context?.date
      serializedPreviewData.push({
        folderPath: folderPath || '',
        date: date || '',
        resources: resources
      })
    }
  })
  console.log(`serializedPreviewData: `, serializedPreviewData)

  return {
    props: { 
      previewData: serializedPreviewData
    }
  }
}