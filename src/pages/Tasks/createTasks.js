import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';
import { baseurl, ProjectStatus, companies } from "../../api";
import { useSelector, useDispatch } from 'react-redux';
import { triggerFunction, getPredefinedUrl } from '../../components/SignedUrl';
import { useHistory } from 'react-router-dom';
import { check } from '../../checkloggedin'
import Multiselect from "../../components/Multiselect";
import { fetchProjects } from "../../features/projectslice";
import {dateinIndia, timeinIndia} from '../../checkloggedin'
const Comp = ({ ptbf, handleFetch }) => {

  const inputRef = React.useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [clickedImage, setClickedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const itemsPerPage = 5; // Define itemsPerPage

  // State variables for edit modal
  const [editProjectName, setEditProjectName] = useState('');
  const [editServiceDescription, setEditServiceDescription] = useState('');
  const [editIsActive, setEditIsActive] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  const [ptype, setPtype] = useState('');
  const [arr, setArr] = useState([]);

  ////mine
  const [key, setKey] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileExtension, setFileExtension] = useState('');
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [folderName, setFolderName] = useState(''); // State for folder name
  const [folders, setFolders] = useState([]); // State for storing folder names
  const [url, setUrl] = useState('');
  const filepath = '../../index.js'

  let history = useHistory();

  const dispatch = useDispatch();
  // for this file only
  const [users, setUsers] = useState([])
  const [username, setUsername] = useState('')
  const [pname, setPname] = useState(ptbf ? ptbf : "")
  const [pnamearr, setPnamearr] = useState([])
  const [tasksubject, setTaskSubject] = useState('')
  const [taskdescription, setTaskdescription] = useState('')
  const [assignedby, setassignedby] = useState('')
  const [selectedusers, setSelectedusers] = useState([])
  const [name, setName] = useState('')
  const token = localStorage.getItem('token');
  const Today = new Date().toISOString().split("T")[0];
  const [deadline, setDeadline] = useState(null)
  const [editFileDate, setEditFileDate] = useState('');
  // project filtering
  let [isActive, setIsActive] = useState(null);
  let [companyname, setCompanyName] = useState('')
  let [isActives, setIsActives] = useState(null)


  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Read file extension
      const fileExtension = file.name;
      setSelectedFile(file);
      setFileExtension(fileExtension);
      let arr1 = await triggerFunction(fileExtension, (folderName).trim())
      setUrl(arr1[0]); // Update URL with folderName
      setKey(arr1[1])
      setIsFileSelected(true); // Enable upload button
    } else {
      setSelectedFile(null);
      setFileExtension('');
      setIsFileSelected(false); // Disable upload button
    }
  };

  const handleUpload = (e) => {
    e.preventDefault()
    // ////////////////////console.log("hi")
    if (selectedFile != null) {
      ////////////////////console.log("hi",selectedFile)
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileContent = event.target.result;
        // Perform your upload logic here
        // For demonstration, let's just log the file extension and content
        ////////////////////console.log('Selected File Extension:', fileExtension);
        ////////////////////console.log('File Content:', fileContent);

        try {
          // Example: Uploading file content using Fetch
          if (selectedFile) {
            const responseFile = await fetch(url, {
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
            ////////////////////console.log('File uploaded successfully:', responseFile);
          }

          toast.success('Image added successfully'); // Call toast.success after successful addition

          // Reload page after successful submission
          // window.location.reload();

          // Clear form data after submission

        } catch (error) {
          //console.error('Error:', error);
          toast.error('Failed to add image'); // Display error toast if addition fails
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
    // api call
    (async () => {
      try {

        const ids = selectedusers.map(user => user.id);
        const body = {
          CreatedAt: Date.now(),
          projectid: pname,
          assignTaskTo: ids,
          assignedby: check()[0],
          taskSubject: tasksubject.trim(),
          taskDescription: taskdescription.trim(),
          deadline: deadline,

          // taskUrl: selectedFile ? getPredefinedUrl(key) : "hello"
        };
        ////////////////////console.log(body)
        // Example: Posting additional form data using Axios
        // const responseFormData = await axios.post(`${baseurl}/project/create`,body, {
        //   headers: {
        //     Authorization: `${token}`,
        //     'Content-Type': 'multipart/form-data', // Set appropriate content type
        //   },
        // });
        await axios.post(`${baseurl}/task/create`, body).then((resp) => {
          toast.success('Task added successfully'); // Call toast.success after successful addition
          handleFetch()
        })
        ////////////////////console.log(responseFormData);
        // window.location.reload()
        setSelectedFile(null)
      } catch (error) {
        // console.log(error);
        // Assuming res is not defined, use //console.error instead
        //console.error({ message: "backend error", data: error });
      }
    })();

  };


  ////////////////////////////////////////////

  const handleprojectFetch = async () => {
    ////////////////////console.log(companyname)

    dispatch(fetchProjects({
      company: companyname ? companyname : null,
      status: isActive ? isActive : null
    })).then((resp) => {
      setPnamearr(resp)
      // ////////console.log(resp)
    }).catch(error => {

    })

  }


  //For Fetching Users and Projects
  useEffect(() => {
    ////////////////////console.log(check())
    axios.get(`${baseurl}/user`)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        //console.error(error);
      });


    handleprojectFetch()
  }, []);









  const handleImagesUpload = (event) => {
    const image = event.target.files[0];
    setImageUrl(image);
  }

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');

    axios.delete(`https://ab.execute-api.ap-south-1.amazonaws.com/production/api/services/${id}`, {
      headers: {
        Authorization: `${token}`
      }
    })
      .then(response => {
        ////////////////////console.log('Record deleted successfully:', response.data);
        setData(prevData => prevData.filter(item => item.id !== id));
        toast.success('Record deleted successfully'); // Display success toast
      })
      .catch(error => {
        //console.error('Error deleting record:', error);
        toast.error('Failed to delete record'); // Display error toast
      });
  }
  // Calculate the index of the first item to display based on the current page and items per page







  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);

  }



  const handleImageClick = (image) => {
    setClickedImage(image);
    setShowModal(true);
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setClickedImage(null);
  }
  const handleEditModal = (item) => {
    setEditItemId(item._id);
    setEditProjectName(item.ProjectName);
    setEditServiceDescription(item.serviceDescription);
    setEditIsActive(item.isActive);
    setClickedImage(item.imageUrl)
    setShowModal(true);
    setEditMode(true); // Set editMode to true when opening the edit modal
  }

  const handleEditSubmit = async () => {
    const token = localStorage.getItem('token');
    const editData = {
      ProjectName: editProjectName,
      serviceDescription: editServiceDescription,
      isActive: editIsActive
    };

    try {
      const response = await axios.put(`https://ab.execute-api.ap-south-1.amazonaws.com/production/api/services/${editItemId}`, editData, {
        headers: {
          Authorization: `${token}`
        }
      });
      ////////////////////console.log('Updated data:', response.data);
      toast.success('Data updated successfully');
      setShowModal(false);
      setData(prevData => prevData.map(item => item._id === editItemId ? { ...item, ...editData } : item));
    } catch (error) {
      //console.error('Error updating record:', error);
      toast.error('Failed to update record');
    }
  }

  // redirect to projects page
  const handleRedirect = (id) => {
    history.push(`/projects/${id}`)
  }


  let startIndex = currentPage * itemsPerPage;
  let endIndex = (currentPage + 1) * itemsPerPage;
  let currentItems = data.slice(startIndex, endIndex);


  return (
    <>
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-2">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Service</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Tab.Container defaultActiveKey="home">
        <Nav fill variant="pills" className="flex-column flex-sm-row">
          <Nav.Item>
            <Nav.Link eventKey="home" className="mb-sm-3 mb-md-0">
              Create Tasks
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="home" className="py-4">
            <section className="d-flex align-items-center my-2 mt-lg-1 mb-lg-5">
              <Container style={{ width: "70%" }}>
                <form onSubmit={(e) => handleUpload(e)}>
                  <Row >
                    <Col xs={12} md={6}>
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>Company Name</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Select value={companyname} onChange={(e) => {
                            companyname = e.target.value
                            setCompanyName(e.target.value)
                            handleprojectFetch()
                          }}>
                            <option value="">Select Option</option>
                            {companies.map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="taskstatus" className="mb-4">
                        <Form.Label>Project Status</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Select value={isActive} onChange={(e) => {
                            isActive = e.target.value
                            setIsActive(e.target.value)
                            handleprojectFetch()
                          }}>
                            <option value="">Select Option</option>
                            {/* Mapping through the arr array to generate options */}
                            {ProjectStatus.map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={3}>
                      <>
                        {/* <Form.Group id="taskstatus" className="mb-4"> */}
                        <Form.Label>Project Search</Form.Label>
                        <Form.Group controlId="editFileName">
                          <Form.Control
                            ref={inputRef}
                            type="text"
                            placeholder="Project Name"
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value)
                              setTimeout(() => {
                                inputRef.current?.focus(); // Retains focus without autofocus
                              }, 0);
                            }
                            }
                          />
                          {/* </InputGroup> */}
                        </Form.Group>
                      </>
                    </Col>
                    <Col xs={12} md={3}>
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>Project name</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Select value={pname} onChange={(e) => setPname(e.target.value)}>
                            <option value="">Select Option</option>
                            {/* Mapping through the arr array to generate options */}
                            {pnamearr.filter((project) =>
                              (companyname === "" || project.company === companyname) &&
                              // (regu === "" || project.regu === regu) &&
                              // (isDisabled === "" || project.isDisabled === isDisabled)
                              ((new RegExp(name, 'i')).test(project.name))
                            ).map((option, index) => (
                              <option key={index} value={option._id}>{option.name}</option>
                            ))}
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                      <Form.Group id="tasksubject" className="mb-4">
                        <Form.Label>Task Subject</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Control required type="text" placeholder="Task Subject" value={tasksubject} onChange={(e) => setTaskSubject(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="Taskdescription" className="mb-4">
                        <Form.Label>Task Description</Form.Label>
                        <InputGroup>
                          <textarea rows="4" cols="60" type="textarea" placeholder="Task Description" value={taskdescription} onChange={(e) => setTaskdescription(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    {/* <Col xs={12} md={6}>
                      <Form.Group id="Project Image" className="mb-4">
                        <Form.Label>Task Image if Required</Form.Label>
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
                    </Col> */}
                    <Col xs={12} md={6}>
                      <Form.Group id="ptype" className="mb-4">
                        <Form.Label>Assign Task To</Form.Label>
                        {users ? (<Multiselect
                          selectedValues={selectedusers}
                          setSelectedValues={setSelectedusers}
                          options={users} />) : (
                          <p>loading</p>
                        )}
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                    <Form.Label>Deadline</Form.Label>
                      <Form.Control
                        type="date"
                        value={deadline}
                        onChange={(e) => {
                          setDeadline(e.target.value)
                          // setvieweditfiledate(new Date(e.target.value).toISOString().split("T")[0])
                        }}
                      />
                    </Col>
                    {/* <Col xs={12} md={6}>
                      <Form.Group id="ptype" className="mb-4">
                        <Form.Label>Assign by</Form.Label>
                        <Form.Select  value={pname} onChange={(e) => setPname(e.target.value)}>
                          <option value="">Select Option</option>
                            {pnamearr.map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                        </Form.Select>
                      </Form.Group>
                    </Col> */}

                    <Col xs={12} md={6} className="d-flex justify-content-center"> {/* Centering the submit button */}
                      <Button variant="primary" type="submit" className="w-100 mt-3">
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </form>
              </Container>
            </section>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      <Modal show={showModal && !editMode} onHide={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>{data.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={clickedImage} alt="Zoomed Image" style={{ maxWidth: "100%" }} onClick={() => setEditMode(true)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Comp