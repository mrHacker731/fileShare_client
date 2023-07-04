"use client"
import React, { useEffect, useState } from 'react'
import './download.css'
import uploadIcon from '../public/upload.png'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import axios from 'axios'
import { BASE_URL } from './Upload'

function DownloadPage() {
  const pathname = usePathname()
  const [uuid, setUUid] = useState();
  const [fileData, setFileData] = useState();
  const [fileSize, setFileSize] = useState();
  const [errorMessage, setErrorMessage] = useState();


  function convertBytesToReadableSize(bytes) {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes < 1024 * 1024) {
      const kb = Math.round(bytes / 1024);
      return kb + ' KB';
    } else if (bytes < 1024 * 1024 * 1024) {
      const mb = Math.round(bytes / (1024 * 1024));
      return mb + ' MB';
    } else {
      const gb = Math.round(bytes / (1024 * 1024 * 1024));
      return gb + ' GB';
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setUUid(pathname.split('/')[2]);
    };

    fetchData();
  }, [pathname]);

  useEffect(() => {
    if (uuid) {
      getData();
    }
  }, [uuid]);

  const getData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/file/uploads/${uuid}`);
      setFileData(response.data);
      setFileSize(convertBytesToReadableSize(response.data.size));
    } catch (error) {
      setErrorMessage('Error occurred while fetching data');
    }
  };

  function downloadFile() {
    const fileUrl = fileData.downloadUrl;

    axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'blob',
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        console.log(url)
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileData.fileName);
        link.click();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div>
      <div className="container">
        <div className="file_container">
          <div className="files">
            <Image style={{ cursor: "pointer" }} height={80} width={80} title='upload' alt='upload' src={uploadIcon} />
            {fileData ? <p>{fileData.fileName}</p> : ''}
            {fileSize ? <h3 style={{ fontSize: "16px", margin: "10px" }}>{fileSize}</h3> : ''}
          </div>
          {fileData ? (<div className="buttons">
            <button onClick={downloadFile}>Download File</button>
          </div>) : ""}
        </div>
      </div>
    </div>
  )
}

export default DownloadPage;
