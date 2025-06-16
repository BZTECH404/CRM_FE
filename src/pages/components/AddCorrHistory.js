import React, { useState, useEffect } from "react";
import axios from "axios";
import {baseurl} from "../../api";
import Swal from 'sweetalert2'
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';

import {triggerFunction,getPredefinedUrl} from '../../components/SignedUrl';

export default ({corr,showModal2,setShowModal2}) => {

    const [texthistory,setaddtexthistory]=useState("")
    let [selectedFiles,setSelectedFiles]=useState([])
    let [stop,setStop]=useState(true)
    let [filename,setfilename]=useState("")

    useEffect(()=>{
        //////console.log(corr)

    },[])

    const handleaddhistorysubmit=async(e)=>{
      e.preventDefault()
      // //////console.log("hi",selectedFiles[0][1])
      // Aws Upload
  
      if(selectedFiles.length!=0){
        let selectedFile=selectedFiles[0][2]
        if (selectedFile) {
          Swal.fire({
            title: 'Uploading...',
            html: 'Please wait while we upload your file.',
            allowOutsideClick: false,
            confirmButtonText: false,
            onOpen: () => {
              Swal.showLoading();
            }
          });
      
            const reader = new FileReader();
            reader.onload = async (event) => {
            const fileContent = event.target.result;
            // Perform your upload logic here
            // For demonstration, let's just log the file extension and content
            //////////////////////console.log('Selected File Extension:', fileExtension);
            //////console.log('File Content:', fileContent);
    
            try {
              // Example: Uploading file content using Fetch
              const responseFile = await fetch(selectedFiles[0][0], {
                method: 'PUT',
                body: fileContent,
                headers: {
                  'Content-Type': 'application/octet-stream', // Set appropriate content type
                },
                mode: 'cors', // Enable CORS
              });
              if (!responseFile.ok) {
                throw new Error('Network response was not ok');
              }
              // toast.success("File Uploaded Succesfully")
              //////console.log('File uploaded successfully:');
              Swal.fire({
                title: 'Success!',
                text: 'File uploaded successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
              });
            } catch (error) {
              console.error('Error:', error);
              Swal.fire({
                title: 'Error!',
                text: 'There was a problem uploading the file.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
              // toast.error('Failed to add image'); // Display error toast if addition fails
            }
          }
    
        reader.readAsArrayBuffer(selectedFile);
      }
    }



      let body={
        description:texthistory,
        filename:filename,
        file:selectedFiles.length!=0?getPredefinedUrl(selectedFiles[0][1]):null

      }
      // //////console.log(body,corr)

        try {
          const response = await axios.post(`${baseurl}/correspondence/node/${corr._id}`,body);
          //////console.log(response.data);
          
          toast.success("History Added Succesfully");
          setShowModal2(false);
          setaddtexthistory("")
        } catch (error) {
          //console.error(error);
          toast.error("Failed to add history");
        }
      }

      const handleFileChange = async (event) => {
        const files = event.target.files;
        const newSelectedFiles = [];
        let newarr=[]
        setStop(false)
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
    
          if (file) {
            // Read file extension
            const fileExtension = file.name;
            // setSelectedFile(file);
            // setFileExtension(fileExtension);
            
            const arr1 = await triggerFunction(fileExtension, (corr.projectname).trim());
            // key=arr1[0]
            // url=arr1[1]
            // setKey(arr1[0])
            // setUrl(arr1[1])
            newarr.push([arr1[0],arr1[1],file])
          }
          setStop(true)
          //////console.log(newarr)
          setSelectedFiles([...selectedFiles, ...newarr]);
        }
      };

  return (
    <>
    <ToastContainer />
      <Modal className="#modal-content" style={{ width: "100%" }} show={showModal2} onHide={() => setShowModal2(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Add Correspondence History
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* Description */}
            <Form.Group  id="Taskdescription" className="mb-4">
                    <Form.Label>Description</Form.Label>
                    <InputGroup>
                        <textarea  rows="5" style={{width:"100%"}}  type="textarea" placeholder="Description"value={texthistory} onChange={(e) => setaddtexthistory(e.target.value)} />
                    </InputGroup>
            </Form.Group>
            {/* File Name */}
            <Form.Group  id="Taskdescription" className="mb-4">
                    <Form.Label>File Name</Form.Label>
                    <Form.Control type="text" value={filename} onChange={(e) => setfilename(e.target.value)} />
            </Form.Group>
                {/* Add File */}
            <Form.Group id="Project Image" className="mb-4">
                    <Form.Label>File</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>
                        </InputGroup.Text>
                        <Form.Control
                        type="file"
                        onChange={handleFileChange}
                        placeholder="Upload Image"
                        />
                    </InputGroup>
            </Form.Group>



                </Modal.Body>
              <Modal.Footer>
                
                <Button variant="secondary" onClick={() => setShowModal2(false)}>
                  Cancel
                </Button>
                {stop?(<Button style={{backgroundColor:"greenyellow"}} variant="secondary" onClick={(e)=>handleaddhistorysubmit(e)}>
                  Save Changes
                </Button>):(null)}
              </Modal.Footer>
      </Modal>
      </>
   
  )
}


