import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
// import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Photo Albums</title>
        <meta name="description" content="Albums of photography by Jason Roundtree" />
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

// export async function getStaticProps() {
//   const res = await fetch('https://photo-album-six.vercel.app/api/album-paths')
//   console.log(`res: `, res)
//   // const albumPaths = await res.json()
//   // console.log(`albumPaths: `, albumPaths)
//   return {
//     props: {
//       a: 'hello'
//     },
//   }
// }