import styles from './page.module.css'
import Image from 'next/image';
import Link from 'next/link';
import { getVideos } from './firebase/functions';


export default async function Home() {
  const videos = await getVideos();

  return (
    <main>
      {
        videos.map((video) => (
          <Link href={`/watch?v=${video.filename}`} key={video.id}>
            <Image src={'/thumbnail.png'} alt='video' width={120} height={80}
              className={styles.thumbnail}/>
          </Link>
        ))
      }
    </main>
  )
}

// this will rerun getVideos() every 30 seconds and 
// update page with new videos
export const revalidate = 30;
