// File: package.json
{
  "name": "ai-multitools-starter",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000"
  },
  "dependencies": {
    "next": "13.4.7",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "swr": "2.2.0"
  }
}

// File: README.md
# AI Multitools - Starter (Option A)

Project starter Next.js sederhana untuk fitur: Text→Speech, Text→Image, Image→Text (OCR).

## Cara cepat (pakai GitHub web UI)
1. Di repo GitHub kamu (`ai-multitools`) klik **Add file → Upload files**.
2. Upload semua file yang ada di folder starter ini (atau isi dari canvas).
3. Commit changes.
4. Di Vercel dashboard klik **Import Git Repository** → pilih repo `ai-multitools` → Deploy.

## Menjalankan lokal
1. Install Node.js LTS
2. `npm install`
3. `npm run dev`
4. Buka http://localhost:3000

## Environment variables (untuk deploy di Vercel)
Buat Environment Variables di Vercel (Project Settings):
- `NEXT_PUBLIC_STABILITY_KEY` - (opsional) API key Stability/Replicate untuk Text→Image
- `NEXT_PUBLIC_GOOGLE_TTS_KEY` - (opsional) Google API key untuk TTS (jika pakai client-side)
- `OPENAI_API_KEY` - (opsional) API key OpenAI jika ingin pakai model OpenAI

> NOTE: Project ini hanya starter UI + proxy API sederhana. Kamu tetap perlu memasukkan API keys tiap layanan.

// File: pages/_app.js
import '../styles/globals.css'
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}

// File: styles/globals.css
:root{--bg:#0b1020;--card:#0f1724;--muted:#9aa4b2;--accent:#6b5ce7}
*{box-sizing:border-box}
body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial;background:linear-gradient(180deg,var(--bg),#071027);color:#e6eef8}
.container{max-width:1000px;margin:32px auto;padding:20px}
.header{display:flex;gap:16px;align-items:center}
.card{background:rgba(255,255,255,0.03);padding:18px;border-radius:12px;margin-top:18px}
.btn{background:var(--accent);border:none;padding:10px 14px;border-radius:8px;color:white;cursor:pointer}
.input{width:100%;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:inherit}
.nav{display:flex;gap:8px;margin-top:12px}
.link{padding:8px 12px;border-radius:8px;background:rgba(255,255,255,0.02);cursor:pointer}

// File: pages/index.js
import Link from 'next/link'
export default function Home(){
  return (
    <div className="container">
      <div className="header">
        <h1>Kampung AI — Multitools (Starter)</h1>
      </div>
      <div className="nav">
        <Link href="/tts"><a className="link">Text → Speech</a></Link>
        <Link href="/t2i"><a className="link">Text → Image</a></Link>
        <Link href="/ocr"><a className="link">Image → Text (OCR)</a></Link>
      </div>

      <div className="card">
        <p>Ini starter UI. Masukkan API key di Vercel environment atau gunakan API key pribadi saat diminta.
        </p>
      </div>
    </div>
  )
}

// File: pages/tts.js
import { useState } from 'react'
export default function TTS(){
  const [text,setText]=useState('Halo, ini demo TTS.')
  const [loading,setLoading]=useState(false)
  const [audioUrl,setAudioUrl]=useState('')

  async function handleGenerate(){
    setLoading(true)
    setAudioUrl('')
    try{
      // contoh memanggil proxy API serverless yang nantinya kita buat (pages/api/tts-proxy.js)
      const res=await fetch('/api/tts-proxy',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text})})
      if(!res.ok) throw new Error('error')
      const data=await res.json()
      setAudioUrl(data.url)
    }catch(e){
      alert('Gagal generate: '+e.message)
    }finally{setLoading(false)}
  }

  return (
    <div className="container">
      <h2>Text → Speech</h2>
      <div className="card">
        <textarea className="input" rows={6} value={text} onChange={(e)=>setText(e.target.value)} />
        <div style={{marginTop:10}}>
          <button className="btn" onClick={handleGenerate} disabled={loading}>{loading?'Generating...':'Generate Voice'}</button>
        </div>
        {audioUrl && (
          <div style={{marginTop:12}}>
            <audio controls src={audioUrl}></audio>
            <div style={{marginTop:8}}><a href={audioUrl} download className="btn">Download MP3</a></div>
          </div>
        )}
      </div>
    </div>
  )
}

// File: pages/t2i.js
import { useState } from 'react'
export default function T2I(){
  const [prompt,setPrompt]=useState('Seorang petani cabai di sawah saat matahari terbenam, realis')
  const [loading,setLoading]=useState(false)
  const [img,setImg]=useState('')

  async function genImage(){
    setLoading(true);setImg('')
    try{
      const res=await fetch('/api/t2i-proxy',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({prompt})})
      if(!res.ok) throw new Error('request failed')
      const data=await res.json()
      setImg(data.image)
    }catch(e){alert(e.message)}
    setLoading(false)
  }

  return (
    <div className="container">
      <h2>Text → Image</h2>
      <div className="card">
        <textarea className="input" rows={4} value={prompt} onChange={(e)=>setPrompt(e.target.value)} />
        <div style={{marginTop:10}}>
          <button className="btn" onClick={genImage} disabled={loading}>{loading?'Generating...':'Generate Image'}</button>
        </div>
        {img && <div style={{marginTop:12}}><img src={img} alt="AI" style={{maxWidth:'100%',borderRadius:8}}/></div>}
      </div>
    </div>
  )
}

// File: pages/ocr.js
import { useState } from 'react'
export default function OCR(){
  const [file,setFile]=useState(null)
  const [text,setText]=useState('')
  const [loading,setLoading]=useState(false)

  async function handleUpload(e){
    const f=e.target.files[0]; if(!f) return; setFile(f)
    setLoading(true); setText('')
    const fd=new FormData(); fd.append('file',f)
    try{
      const res=await fetch('/api/ocr-proxy',{method:'POST',body:fd})
      if(!res.ok) throw new Error('OCR failed')
      const data=await res.json(); setText(data.text || '')
    }catch(e){alert(e.message)}
    setLoading(false)
  }

  return (
    <div className="container">
      <h2>Image → Text (OCR)</h2>
      <div className="card">
        <input type="file" accept="image/*" onChange={handleUpload} />
        {loading? <p>Processing...</p> : <pre style={{whiteSpace:'pre-wrap',marginTop:12}}>{text}</pre>}
      </div>
    </div>
  )
}

// File: pages/api/tts-proxy.js
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end()
  const {text} = req.body
  // SIMPLE PLACEHOLDER: return a silent audio file or instruct user to add API key
  // For real use: implement call to Google TTS / ElevenLabs / OpenAI TTS here using server-side API key from env
  // Example response: return a publicly accessible URL to generated mp3

  // For starter demo, return a data URL of a short silent wav (very small)
  const silentDataUrl = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="
  return res.status(200).json({url:silentDataUrl})
}

// File: pages/api/t2i-proxy.js
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end()
  const {prompt} = req.body
  // Placeholder: Instruct user to set NEXT_PUBLIC_STABILITY_KEY or use server-side key
  // For demo we return a sample placeholder image
  const sample = 'https://via.placeholder.com/800x450.png?text=AI+Image+Placeholder'
  return res.status(200).json({image:sample})
}

// File: pages/api/ocr-proxy.js
export const config = { api: { bodyParser: false } }
import formidable from 'formidable'
import fs from 'fs'

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end()
  const form = new formidable.IncomingForm()
  form.parse(req, (err, fields, files) => {
    if(err) return res.status(500).json({error:err.message})
    // For starter: return a sample text
    return res.status(200).json({text:'Sample OCR output (replace with real OCR integration).'})
  })
}

// File: .gitignore
node_modules
.next
.env.local

// End of starter files
