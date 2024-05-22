import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DataTable from '../components/DataTable';

interface UploadedFile {
  filename: string;
}

export default function Home() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string>("");
  const [resultfileContent, setResultfileContent] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const uploadedFiles = await axios.get('/api/uploads/list');
    setUploadedFiles(uploadedFiles.data.files);

    const resultFile = await axios.get('/api/result/get');
    setResultfileContent(resultFile.data.content);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(e.target.files);
    setPendingFiles(selectedFiles);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(e.dataTransfer.files);
    setPendingFiles(droppedFiles);
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleUploadClear = () => {
    setPendingFiles([]);
    fileInput.current!.value = '';
    setFiles(null);
  }
  
  const handleUpload = async (e: any) => {
    if (!files) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append(file.name, file);
    });

    const res = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = res.data;

    if (res.status === 200) {
      setMessage('Files uploaded successfully');
      setPendingFiles([]);
      fileInput.current!.value = '';
      setFiles(null);
      fetchFiles();
    } else {
      setMessage(data.error);
    }
  };

  const handleMerge = async () => {
    const res = await axios.post('/api/merge', { filesToMerge: uploadedFiles }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = res.data;
    if (res.status === 200) {
      setMessage(data.message);
      fetchFiles();
    } else {
      setMessage(data.error);
    }
  };

  const handleDeleteUploadsAll = async () => {
    const res = await axios.delete('/api/uploads/delete/all');
    const data = res.data;
    if (res.status === 200) {
      setMessage(data.message);
      fetchFiles();
    } else {
      setMessage(data.error);
    }
  }

  const handleDeleteUpload = async (fileName: string) => {
    const res = await axios.delete(`/api/uploads/delete/file?fileName=${fileName}`);
    const data = res.data;
    if (res.status === 200) {
      setMessage(data.message);
      fetchFiles();
    } else {
      setMessage(data.error);
    }
  }

  const handleDeleteResult = async () => {
    const res = await axios.delete('/api/result/delete');
    const data = res.data;
    if (res.status === 200) {
      setMessage(data.message);
      fetchFiles();
    } else {
      setMessage(data.error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-4">😘 두근두근 시은이의 파일 합치기 게임 😘</h1>
      <div className="relative">
        <div className="grid grid-cols-5 gap-6">
          <form className="flex flex-col items-center space-y-4 col-span-3">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              className={`w-full min-h-32 h-full border-2 ${isDragging ? 'border-blue-500 bg-blue-100' : 'border-dashed border-gray-300'} rounded-md flex justify-center items-center`}
            >
              <p className="text-gray-500">합치고 싶은 파일들을 여기에 드래그 & 드랍 해주쇼</p>
              <input ref={fileInput}  type="file" multiple onChange={handleFileChange} className="hidden" />
            </div>
          </form>
          <div className="col-span-2">
            <h2 className="text-xl font-semibold">업로드 대기 파일 목록</h2>
            <ul className="list-disc list-inside mt-2 p-2 border-2 min-h-[90px] rounded-md border-gray-200">
              {pendingFiles.map((file, index) => (
                <li key={index} className="text-gray-700">{file.name}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-row-reverse">
          <button 
            type="submit" 
            className="px-4 py-2 mt-4 bg-red-500 text-white rounded"
            onClick={handleUploadClear}>Clear All</button>
          <button 
            type="submit" 
            className="px-4 py-2 mt-4 mr-2 bg-blue-500 text-white rounded"
            onClick={handleUpload}>Upload</button>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-xl font-semibold">합칠 파일 목록</h2>
        <div className="mt-2">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="text-gray-700">
                <span>- {file}</span>
                <button onClick={() => handleDeleteUpload(file)} className="ml-2 text-red-500">⛔︎</button>
            </div>
          ))}
        </div>
        {uploadedFiles.length === 0 && <p className="text-gray-500">합칠 파일이 없습니다.</p>}
        {uploadedFiles.length > 0 && <div>
          <button onClick={handleMerge} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Merge</button>
          <button onClick={handleDeleteUploadsAll} className="mt-4 ml-2 px-4 py-2 bg-red-600 text-white rounded">Clear All</button>
        </div>}
      </div>
      {/* {message && <p className="mt-4 text-center text-red-500">{message}</p>} */}
      {resultfileContent !== ""  && (
        <div className='mt-8'>
          <div className='flex'>
            <h2 className="text-xl font-semibold flex-grow">합체 결과</h2>
            <a href="/api/result/download" className="ml-2 px-2 py-1 bg-blue-500 text-white rounded">csv 다운로드</a>
            <button onClick={handleDeleteResult} className="ml-2 px-2 py-1 bg-red-500 text-white rounded">결과 초기화</button>

          </div>
          <div className="mt-4 text-center">
              <DataTable data={resultfileContent} />
          </div>
        </div>
      )}
    </div>
  );
}
