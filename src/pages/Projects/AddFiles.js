import React, { useState, useEffect } from "react";
import axios from 'axios';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';
import { baseurl, ProjectStatus } from "../../api";
import { useSelector, useDispatch } from 'react-redux';
import { triggerFunction, getPredefinedUrl } from '../../components/SignedUrl';
import { useHistory } from 'react-router-dom';
import { fetchProjects, importquestions, addfiles, deletefiles, OrderUpdate, createStory, getStories, deleteStory, OrderUpdateStory } from "../../features/projectslice";
import Multiselect from "../../components/Multiselect";
import { check, checkloginvailidity, geturl, timeinIndia } from '../../checkloggedin.js';
import Swal from 'sweetalert2'

const AddFiles = ({ thisproject, id, setfiles, files, getfiles }) => {
    const [createdate, setCreateDate] = useState('')
    const [filename, setfilename] = useState('')
    let [selectedFiles, setSelectedFiles] = useState([])
    let [stop, setstop] = useState(true)


    const handleFileChange = async (event) => {
        const files = event.target.files;
        //////console.log(files)
        const newSelectedFiles = [];
        setstop(false)
        let newarr = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (file) {
                // Read file extension
                const fileExtension = file.name;
                const arr1 = await triggerFunction(fileExtension, (thisproject.name).trim());
                // key=arr1[0]
                // url=arr1[1]
                // setKey(arr1[0])
                // setUrl(arr1[1])
                newarr.push([arr1[0], arr1[1], file])

            }
            //console.log(newarr)
            setSelectedFiles([...selectedFiles, ...newarr]);
        }
        setstop(true)
        console.log(selectedFiles)
    };
    const fileUploader = (selectedFiles) => {
        return new Promise(async (resolve, reject) => {
            let urlarr = [];

            // Create an array of promises for file uploads
            const uploadPromises = selectedFiles.map((fileData) => {
                return new Promise((resolve, reject) => {

                    let fileurl = fileData[0];
                    let selectedFile = fileData[2];
                    
                    console.log(selectedFile.name, selectedFile.name.replace(/\+|(\.[^\.]+)$/g, ''))
                    if (selectedFile) {
                        const reader = new FileReader();
                        const fileExists = files.some(file => file.filename === selectedFile.name.replace(/\+|(\.[^\.]+)$/g, ''));
                        if (fileExists) {
                            Swal.fire({
                                title: 'Error!',
                                text: `File ${selectedFile.name}" already exists. Skipping upload.`,
                                icon: 'error',
                                confirmButtonText: 'OK',
                            });
                            console.log(`File "${selectedFile.name}" already exists. Skipping upload.`);
                            resolve(); // Skip this file upload
                            return;
                        }
                        reader.onload = async () => {
                            try {
                                Swal.fire({
                                    title: 'Uploading...',
                                    html: 'Please wait while we upload your file.',
                                    allowOutsideClick: false,
                                    didOpen: () => {
                                        Swal.showLoading();
                                    }
                                });

                                // Perform the file upload
                                const responseFile = await fetch(fileurl, {
                                    method: 'PUT',
                                    body: selectedFile,
                                    headers: {
                                        'Content-Type': 'application/octet-stream', // Set appropriate content type
                                    },
                                    mode: 'cors', // Enable CORS
                                });

                                // if (!responseFile.ok) {
                                //     throw new Error('Network response was not ok');
                                // }

                                // Add file URL to the array
                                urlarr.push([
                                    getPredefinedUrl(fileData[1]),
                                    selectedFile.name.replace(/\+|(\.[^\.]+)$/g, ''),
                                ]);

                                Swal.fire({
                                    title: 'Success!',
                                    text: 'File uploaded successfully.',
                                    icon: 'success',
                                    confirmButtonText: 'OK',
                                });

                                resolve(); // Resolve the promise for this file
                            } catch (error) {
                                console.error('Upload error:', error);
                                Swal.fire({
                                    title: 'Error!',
                                    text: 'There was a problem uploading the file.',
                                    icon: 'error',
                                    confirmButtonText: 'OK',
                                });
                                reject(error); // Reject the promise if upload fails
                            }
                        };

                        reader.onerror = (error) => {
                            console.error('FileReader error:', error);
                            reject(error); // Reject the promise on FileReader error
                        };

                        // Read the file as ArrayBuffer
                        reader.readAsArrayBuffer(selectedFile);
                    } else {
                        resolve(); // Resolve immediately if no file is selected
                    }
                });
            });

            // Wait for all upload promises to complete
            await Promise.all(uploadPromises);

            // Resolve the final array
            resolve(urlarr);
        });
    };

    const addfiles = async (body) => {
        try {
            const urlarr = await fileUploader(selectedFiles);
            console.log(urlarr);

            let bodyu = {
                date: Date.now(),
                id: body.id,
                filesfrom: urlarr,
            };

            await axios.put(`${baseurl}/project/addfiles/${body.id}`, bodyu);
            toast.success('All Files added successfully'); // Call toast.success after successful addition
            selectedFiles = []
            setSelectedFiles([]); // Clear selected files
            getfiles(); // Fetch updated files
        } catch (error) {
            console.error('MongoDB error:', error);
            toast.error('Failed to add Files'); // Display error toast if addition fails
        }
    };
    return (
        <>
            <section className="d-flex align-items-center my-2 mt-lg-3 mb-lg-5">
                <Container>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        fileUploader(selectedFiles);
                        addfiles({
                            id: id
                        });
                    }}>
                        <Row>
                            {/* <Col xs={12} md={6}>
                                <Form.Group id="pname" className="mb-4">
                                    <Form.Label>Creation Date</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text></InputGroup.Text>
                                        <Form.Control
                                            
                                            type="date"
                                            placeholder="Amount"
                                            value={createdate}
                                            onChange={(e) => setCreateDate(e.target.value)}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Col> */}
                            {/* <Col xs={12} md={6}>
                                <Form.Group id="pName" className="mb-4">
                                    <Form.Label>File Name</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text></InputGroup.Text>
                                        <Form.Control
                                            
                                            required
                                            type="text"
                                            placeholder="File Name"
                                            value={filename}
                                            onChange={(e) => setfilename(e.target.value)}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Col> */}
                            <Col xs={12} md={6}>

                                <Form.Group id="Project Image" className="mb-4">
                                    <InputGroup>
                                        <InputGroup.Text></InputGroup.Text>
                                        <Form.Control
                                            multiple
                                            type="file"
                                            onChange={handleFileChange}
                                            placeholder="Upload Image"
                                        />
                                    </InputGroup>
                                </Form.Group>

                            </Col>
                            {stop ? (<><Col className="d-flex justify-content-center">
                                <Button variant="primary" type="submit" className="w-100 mt-3">Submit</Button>
                            </Col></>) : (<></>)}
                        </Row>
                    </form>
                </Container>
            </section>

        </>
    )
}

export default AddFiles