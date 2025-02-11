import Image from "next/image"
import Head from 'next/head'
import { useState } from 'react'
import { QRCodeCanvas } from "qrcode.react"


export default function Home() {
  const [ files, setFiles ] = useState([])
  const [ fileUrls, setFileUrls ] = useState([])
  const [ transferClicked, setTransferClicked ] = useState(false)
  const [ qrValue, setQrValue ] = useState('')
  const [ isLoading, setIsLoading ] = useState(false)


  // this is what happens when the user uploads images
  function handleFileChange(e){
    const images = Array.from(e.target.files) // an array of images selected by the user
    const urls = images.map(img => URL.createObjectURL(img))
    setFileUrls(urls) // store file urls in state for preview
    setFiles(images) // store images in state for later download
  }

  async function createSession(){

    const formData = new FormData()
    files.forEach(
      file => formData.append('files', file)
    )

    const response = await fetch('https://transfer-app-v6cl.onrender.com/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })

    try {
      const data = await response.json()
      console.log(data)
      return data.sessionId
    } catch (e) {
      console.error("No session id was found")
      console.error("Error: ", e)
    }

  }

  async function generateQrCode(){
    const sessionId = await createSession()
    
    if (files.length == 0){
      alert("Please upload at least one image.")
      return;
    }

    setTimeout(() => {
      const fileTransferUrl = `https://transfer-app-v6cl.onrender.com/transfer/${sessionId}`
      setQrValue(fileTransferUrl)
      setTransferClicked(true)
    }, 2000)


  }

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cairo:wght@200..1000&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
      </Head>
      <div className="flex flex-col justify-center items-center h-screen w-screen">
        <h1 className="text-center font-Cairo font-bold text-6xl">Transfer images from your computer to your phone</h1>
        {  fileUrls.length > 0 && !transferClicked && (
          <div className="mt-16 grid grid-cols-4 gap-4">
            {fileUrls.map((url, index) => (
              <div key={index} className="relative w-60 h-60">
                <Image
                src={url}
                width={200}
                height={200}
                alt={`uploaded-${index}`}
                className="object-cover w-full h-full rounded-lg"
                />
                <button type="button" className="absolute -top-2 -right-2 rounded-full bg-gray-800 h-8 w-8 flex flex-col justify-center items-center text-lg text-gray-50 p-2 font-bold font-Cairo">X</button>
              </div>
            ))}
          </div>
        )}
        {
          fileUrls.length > 0 
          ?
          <button type="button" onClick={generateQrCode} className="bg-gray-800 text-gray-50 px-8 py-3 rounded-full font-Cairo font-bold text-4xl mt-24">
            Transfer
          </button>
          :
          <button type="button" onClick={() => document.getElementById('fileUpload').click()} className="bg-gray-800 text-gray-50 px-8 py-3 rounded-full font-Cairo font-bold text-4xl mt-24">
            Upload
          </button>
        }
        { qrValue.length > 0 &&
          <>
            <p className="font-Cairo mb-14 text-gray-600 font-bold text-3xl">Scan the QR Code below to start the transfer: </p>
            <QRCodeCanvas value={qrValue} size={200} /> 
          </>
        }
        <input type="file" className="hidden" onChange={handleFileChange} id="fileUpload" accept="image/png" multiple />
      </div>
    </>
  )
}
