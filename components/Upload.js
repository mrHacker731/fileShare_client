"use client"
import React, { useEffect, useRef, useState } from 'react';
import './upload.css';
import Image from 'next/image';
import uploadIcon from '../public/upload.png';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const BASE_URL = "https://file-share-0a4m.onrender.com";

function Upload() {
  const [file, setFile] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uuid, setUuid] = useState('');

  useEffect(() => {
    if (file) {
      const uploadFile = async () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('uuid', uuid);

        try {
          await axios.post(`${BASE_URL}/api/v1/file/upload`, formData, {
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
              setUploadProgress(progress);
            },
          });
          console.log('File uploaded successfully!');
        } catch (error) {
          console.log(error);
        }
      };

      uploadFile();
    }
  }, [file, uuid,uploadProgress]);

  const inputRef = useRef(null);

  const handleInputClick = () => {
    if (inputRef.current) {
      inputRef.current.select();
      document.execCommand('copy');
      console.log('Value copied:', inputRef.current.value);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const newUuid = uuidv4();
    setUuid(newUuid);
  };

  return (
    <div>
      <div className="container">
        <form>
          <label htmlFor="file_input">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '5px' }}>
              <Image
                style={{ cursor: 'pointer' }}
                height={50}
                width={50}
                title="upload"
                alt="upload"
                src={uploadIcon}
              />
            </div>
            {file ? <p>{file.name}</p> : ''}
          </label>
          <input
            onChange={handleFileChange}
            id="file_input"
            type="file"
            hidden
          />
          
        </form>
        <div className="upload_progress">
          <div
            className="progress"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
        {uploadProgress === 100 && (
          <div>
            <div className="upload_box">
              <Image
                style={{ cursor: 'pointer' }}
                height={50}
                width={50}
                title="upload"
                alt="upload"
                src={uploadIcon}
              />
              <h1>{file ? file.name : 'file name'}</h1>
            </div>
            <div className="file_url">
              <p>file upload url</p>
              <input
                ref={inputRef}
                type="text"
                defaultValue={`${window.location.href}download/${uuid}`}
                onClick={handleInputClick}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;
