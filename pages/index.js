import Head from 'next/head'
export default function Home() {
  return (
    <>
      <Head>
        <title>AI Multitools Starter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{maxWidth:800, margin:'40px auto', fontFamily:'Arial, sans-serif'}}>
        <h1>AI Multitools — Starter</h1>
        <p>This is a minimal Next.js starter prepared by assistant.</p>
        <ul>
          <li>Text → Speech</li>
          <li>Text → Image</li>
          <li>Image → Text (OCR)</li>
          <li>Image → Video</li>
        </ul>
        <p>To continue, upload this project to your GitHub repo and deploy to Vercel.</p>
      </main>
    </>
  )
}
