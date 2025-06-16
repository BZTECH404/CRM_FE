import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav, SplitButton } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';
import { baseurl, ProjectStatus } from "../../api";
import { useSelector, useDispatch } from 'react-redux';
import { triggerFunction, getPredefinedUrl } from '../../components/SignedUrl';
import { useHistory } from 'react-router-dom';
import { fetchProjects, importquestions, addfiles, deletefiles, OrderUpdate, createStory, getStories, deleteStory, OrderUpdateStory } from "../../features/projectslice";
import Multiselect from "../../components/Multiselect";
import { check, checkloginvailidity, geturl, timeinIndia } from '../../checkloggedin.js';
import { Dropdown } from 'react-bootstrap';


import Swal from 'sweetalert2';

const Files = ({ files, setfiles, id, thisproject }) => {
    let [isD1, setIsD1] = useState(false)
    const [filename, setfilename] = useState('')
    let [editmode, seteditmode] = useState(false)
    const [editFileId, setEditFileId] = useState('');
    const [editFileDate, setEditFileDate] = useState('');
    const [editFileOrder, setEditFileOrder] = useState('0');
    const [editFileLink, setEditFileLink] = useState('');
    const [editFileName, setEditFileName] = useState('');
    const [midfiles, setmidfiles] = useState([])
    const [showModal, setShowModal] = useState(false);

    const [vieweditfiledate, setvieweditfiledate] = useState(null)
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fileExtension, setFileExtension] = useState('');
    let [editSelected, seteditSelectedFiles] = useState([])
    let [stop, setstop] = useState(true)
    let [createdoption, setCreatedoption] = useState(2)
    let [temp, settemp] = useState(2)

    const dispatch = useDispatch();

    useEffect(() => {
        setmidfiles(files)
    }, [files])
    const fileadd = async (bool) => {
        // Check if files are available in `thisprojet`
        if (!thisproject || !thisproject.files) {
            console.error('No files found in thisproject.');
            return;
        }
        let files = thisproject.files;
        if (bool === "") {
            // Set the files to the original list if bool is empty
            setmidfiles(files)
        } else {
            // Filter stories based on the `bool` parameter
            let temp = [];
            for (let i = 0; i < files.length; i++) {
                if ((files[i].isDisabled).toString() === bool.toString()) {
                    temp.push(files[i]);
                }
            }
            // Update the state or do something with the filtered files
            setmidfiles(temp)
        }

    };

    const handleEditModal = (item) => {
        let temp = []
        let temppro = item.projects
        //////console.log(item)
        setEditMode(true); // Set edit mode to true for editing functionality
        // Set state variables to populate the modal with current file details
        setEditFileId(item._id); // ID of the file being edited
        setEditFileName(item.filename); // File name
        setEditFileOrder(item.order); // File order
        setEditFileLink(item.current); // File link (URL)
        // console.log(item.date)
        setEditFileDate(item.date); // File date
        setvieweditfiledate(new Date(item.date).toISOString().split("T")[0])


        // Show the modal
        setShowModal(true);
    }
    const searchfiles = (searchTerm) => {
        // Create a regex for case-insensitive search
        const regex = new RegExp(searchTerm, 'i');
        // Filter files by checking the IST-converted date
        const filtered = files.filter((item) => {
            const istDate = timeinIndia(item.date); // Convert database date to IST
            return (
                regex.test(istDate) ||
                regex.test(item.filename)
            ) // Test the IST date against the regex
        });
        setmidfiles(filtered)
        // console.log(filtered);
    };
    const handleSaveChanges = async () => {
        setLoading(true); // Show the loader
        console.log(editFileDate)

        try {
            //////console.log(editFileDate, editFileName, editFileOrder, fileUrl);
            //////console.log(selectedFile);
            //////console.log(editSelected);
            // let filearr = body.file
            // Function to handle file upload
            const fileUploadHandler = async (file, uploadUrl) => {
                //console.log(file, uploadUrl);
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = async (event) => {
                        // const fileContent = event.target.result;
                        // //console.log(fileContent)
                        try {
                            const responseFile = await fetch(uploadUrl, {
                                method: 'PUT',
                                body: file,
                                headers: {
                                    'Content-Type': 'application/octet-stream',
                                },
                                mode: 'cors',
                            });

                            if (!responseFile.ok) {
                                throw new Error('Network response was not ok');
                            }

                            Swal.fire({
                                icon: 'success',
                                title: 'File Uploaded Successfully',
                                text: 'The file was uploaded successfully.',
                                timer: 2000,
                                showConfirmButton: false,
                            });

                            resolve(true); // Indicate success
                        } catch (error) {
                            console.error('Error uploading file:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Failed to Upload File',
                                text: 'There was an error uploading the file.',
                                timer: 2000,
                                showConfirmButton: false,
                            });

                            resolve(false); // Indicate failure
                        }
                    };
                    reader.readAsArrayBuffer(file);
                });
            };

            // Handle file upload if a file is selected
            if (editSelected.length !== 0) {
                //console.log("here")
                await fileUploadHandler(editSelected[0][2], editSelected[0][0]);
            }

            const token = localStorage.getItem('token');

            // Update the files array
            let body = {
                date: editFileDate,
                filename: editFileName,
                current: editSelected.length !== 0 ? getPredefinedUrl(editSelected[0][1]) : null, // This can remain empty or store other necessary information
            };
            //////console.log(body);

            // Make a PUT request to update the project with the new files array
            const response = await axios.put(
                `${baseurl}/project/update/${id}/${editFileId}`,
                body,
                { headers: { Authorization: ` ${token}` } }
            );

            // Handle the response
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'File Details Updated Successfully',
                    text: 'The file details were updated successfully.',
                    timer: 2000,
                    showConfirmButton: false,
                });

                setShowModal(false); // Close the modal after a successful update
            } else {
                throw new Error('Unexpected response status');
            }
            const updatedFiles = files.map((file) =>
                file.order == editFileOrder
                    ? {
                        ...file,
                        date: editFileDate,
                        filename: editFileName,
                        current: body.current || file.current,
                    }
                    : file
            );
            setfiles(updatedFiles)
            setmidfiles(updatedFiles)

            // dispatch(fetchProjects({
            //     // company: companyname ? companyname : null,
            //     // status: feactive ? feactive : null,
            //     // isDisabled: isDisabled === 'true',
            //     id: id
            // })).then((resp) => {
            //     setthisproject(resp[0]);
            //     thisproject = resp[0];
            //     console.log(thisproject);
            //     let temp = thisproject.files;
            //     let finalfiles = temp.filter((val) => !val.isDisabled);
            //     files = finalfiles;
            //     setfiles(finalfiles);
            //     setmidfiles(finalfiles)
            // }).catch(error => {
            //     console.error('Error fetching projects:', error);
            // });

        } catch (error) {
            console.error('Error updating file:', error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to Update File Details',
                text: 'There was an error updating the file details.',
                timer: 2000,
                showConfirmButton: false,
            });
        } finally {
            setLoading(false); // Hide the loader after the operation
        }
    };

    const downloadFile = async (fileUrl, fileName) => {
        try {
            // Fetch the file
            const urlParts = fileUrl.split('/');
            // Replace the domain part (e.g., officecrm560)
            urlParts[2] = urlParts[2].replace(/^[^\.]+/, "officecrm560");
            fileUrl = urlParts.join('/');
            console.log(fileUrl)
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error("Failed to fetch file");
            }
            const blob = await response.blob();

            // Create a link element and download the file with a custom name
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName; // Specify the custom file name here
            document.body.appendChild(a);
            a.click();

            // Cleanup
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading the file:", error);
        }
    }


    const handleEditFileChange = async (event) => {
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
                // setSelectedFile(file);
                setFileExtension(fileExtension);

                const arr1 = await triggerFunction(fileExtension, (thisproject.name).trim());
                // key=arr1[0]
                // url=arr1[1]
                // setKey(arr1[0])
                // setUrl(arr1[1])
                newarr.push([arr1[0], arr1[1], file])

            }
            //console.log(newarr)

            seteditSelectedFiles([...editSelected, ...newarr]);
        }
        setstop(true)
    };

    const handleDelete = (pid, fid,) => {
        dispatch(deletefiles(pid, fid));
    };
    return (
        <>
            <Row>
                <Col xs={12} md={4}>
                    {/* <SplitButton
                        id="custom-split-button"
                        title="Actions"
                        menuAlign="right"
                        type="button"
                        variant="primary" // Change this to 'success', 'danger', 'warning', etc.
                        toggleLabel="Toggle Dropdown"
                        className="my-custom-button"
                        onClick={() => console.log('Button clicked!')}
                        // style={{color:"white",border:"1px solid red"}}
                    >
                        <Dropdown.Item href="#/action-1">Action 1</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Action 2</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Action 3</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item href="#/action-4">Separated Action</Dropdown.Item>
                    </SplitButton> */}
                    {check() ?
                        // && check()[1] === 'john_doe' ? 
                        (
                            <>
                                {/* <Form.Group id="taskstatus" className="mb-4"> */}
                                <Form.Label>isDisabled</Form.Label>
                                <Form.Select
                                    value={isD1}
                                    onChange={(e) => {
                                        const selectedValue = e.target.value;
                                        setIsD1(String(selectedValue));  // Convert to string and update state
                                        fileadd(String(selectedValue));       // Pass the string value to storyadd
                                    }}
                                >
                                    <option value="">Select Option</option>
                                    <option value={true}>True</option>
                                    <option value={false}>False</option>
                                </Form.Select>
                                {/* <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleDelete(id, row._id)}
                                >
                                    Edit
                                </Button> */}
                            </>
                        ) : (
                            <p>hi</p>
                        )}
                </Col>
                <Col xs={12} md={4}>
                    <>
                        {/* <Form.Group id="taskstatus" className="mb-4"> */}
                        <Form.Label>Search</Form.Label>
                        <Form.Group controlId="editFileName">
                            <Form.Control
                                
                                required
                                type="text"
                                placeholder="File Name or Date"
                                value={filename}
                                onChange={(e) => {
                                    setfilename(e.target.value)
                                    searchfiles(e.target.value)
                                }
                                }
                            />
                            {/* </InputGroup> */}
                        </Form.Group>
                    </>
                </Col>
            </Row>
            {/* <Col> */}

            {/* </Col> */}
            {/* <Col className="text-start">
              <Button variant="secondary" size="sm" onClick={() => seteditorder(!editorder)}>Edit</Button>
              <Button variant="secondary" size="sm" onClick={() => dispatch(OrderUpdate(id, files))}>Update order</Button>
            </Col> */}
            <Table style={{width:"900px"}} className="align-items-center table-flush">
                <thead className="thead-light">
                    <tr>
                        <th className="unselectable" style={{ cursor: "pointer" }} onClick={() => settemp(temp === 1 ? 2 : 1)}>Date</th>
                        <th scope="col">File</th>
                        <th scope="col">Link</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        midfiles && midfiles && [...midfiles].sort((a, b) => {
                            if (temp === 1) {
                                return new Date(a.date) - new Date(b.date); // Ascending order
                            } else if (temp === 2) {
                                return new Date(b.date) - new Date(a.date); // Descending order
                            }
                            return 0;
                        }).map((row, index) => (
                            <tr key={index}>
                                {/* <td
                        style={{ maxWidth: "100px", cursor: "pointer" }}
                        onClick={() => handleRedirect(id, files)}
                      >
                        {editorder ? (
                          <Form.Control
                            
                            required
                            type="text"
                            placeholder="Order"
                            value={row.order}
                            onChange={(e) => handleeditorder(row._id, e.target.value)}
                          />
                        ) : (
                          <p>{row.order}</p>
                        )}
                      </td> */}
                                <td>{timeinIndia(row.date)}</td>
                                <td
                                    style={{ maxWidth: "100px", cursor: "pointer", whiteSpace: "pre-wrap" }}
                                    onClick={() => handleRedirect(row._id)}
                                >
                                    {row.filename+"."+row?.current?.split(".").pop()}
                                </td>
                                <td>
                                    {/* <a href={row.current} onClick={()=>downloadFile("row.current", "hello.pdf")}download style={{ textDecoration: "underline", color: "blue" }}>Link</a> */}

                                    <div onClick={() => {
                                        let pawan = (row.current).split(".")
                                        // console.log(pawan)
                                        downloadFile(row.current, row.filename + "." + pawan[pawan.length - 1])
                                    }} style={{ textDecoration: "underline", color: "blue" }}>Link</div>
                                </td>
                                {check()?.[0] && (
                                    <td>
                                        <Button variant="info" size="sm" onClick={() => handleEditModal(row)}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(id, row._id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </td>)}
                            </tr>
                        ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}    style={{ width: "100%", overflow: "scroll" }}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit File Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form >
                        <Form.Group controlId="editFileName">
                            <Form.Label>File Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={vieweditfiledate}
                                onChange={(e) => {
                                    setEditFileDate(e.target.value)
                                    setvieweditfiledate(new Date(e.target.value).toISOString().split("T")[0])
                                }}
                            />

                        </Form.Group>
                        <Form.Group controlId="editFileName">
                            <Form.Label>File Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editFileName}
                                onChange={(e) => setEditFileName(e.target.value)}
                            />
                        </Form.Group>
                        {/* <Form.Group controlId="editFileOrder">
              <Form.Label>Order</Form.Label>
              <Form.Control
                type="text"
                value={editFileOrder}
                onChange={(e) => setEditFileOrder(e.target.value)}
              />
            </Form.Group> */}
                        <Form.Group id="Project Image" className="mb-4">
                            <Form.Label>Project File</Form.Label>
                            <InputGroup>
                                <InputGroup.Text></InputGroup.Text>
                                <Form.Control
                                    type="file"
                                    onChange={handleEditFileChange}
                                    placeholder="Upload Image"
                                />
                            </InputGroup>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    {stop ? (<><Col className="d-flex justify-content-end">
                        <Button variant="primary" type="submit" className="w-20 mt-3" onClick={() => {
                            handleSaveChanges()
                        }}>Submit</Button>
                    </Col></>) : (<></>)}
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Files