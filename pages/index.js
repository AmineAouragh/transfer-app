import Image from "next/image"
import Head from 'next/head'
import { useState } from 'react'
import { QRCodeCanvas } from "qrcode.react"


export default function Home() {
  const [ files, setFiles ] = useState([])
  const [ fileUrls, setFileUrls ] = useState([])
  const [ transferClicked, setTransferClicked ] = useState(false)
  const [ qrValue, setQrValue ] = useState('')

  function handleFileChange(e){
    const selectedFiles = Array.from(e.target.files)
    setFiles(selectedFiles)

    const urls = selectedFiles.map(file => URL.createObjectURL(file))
    setFileUrls(urls)
  }

  async function generateQrCode(){
    setTransferClicked(true)
    if (files.length == 0){
      alert("Please upload at least one image.")
      return;
    }

    const sessionId = Math.random().toString(36).substring(2, 15)
    const fileTransferUrl = `https://transfer-app-teal.vercel.app/transfer?session=${sessionId}`

    setQrValue(fileTransferUrl)
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
        { transferClicked &&
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
