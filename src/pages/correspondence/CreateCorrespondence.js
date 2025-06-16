import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';
import { baseurl, ProjectStatus, companies, Type } from "../../api";
import { useSelector, useDispatch } from 'react-redux';
import { triggerFunction, getPredefinedUrl } from '../../components/SignedUrl';
import { useHistory } from 'react-router-dom';
import { check } from '../../checkloggedin'
import Multiselect from "../../components/Multiselect";
import { fetchProjects } from "../../features/projectslice";
import { addcorrespondence, getcorrespondence } from "../../features/correspondenceSlice";

export default () => {

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
  let [selectedFiles, setSelectedFiles] = useState([])
  // Acknowledgement
  let [selectedFilesack, setSelectedFilesack] = useState([])

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
  const [pname, setPname] = useState('')
  const [pnamearr, setPnamearr] = useState([])
  const [tasksubject, setTaskSubject] = useState('')
  const [taskdescription, setTaskdescription] = useState('')
  const [assignedby, setassignedby] = useState('')
  const [selectedusers, setSelectedusers] = useState([])
  const Today = new Date().toISOString().split("T")[0];
  const [createdate, setCreateDate] = useState(Today)
  let [projectname, setprojectname] = useState("")
  const [form, setForm] = useState("")
  const [to, setTo] = useState("")

  const token = localStorage.getItem('token');


  // project filtering
  let [isActive, setIsActive] = useState(null);
  let [companyname, setCompanyName] = useState('')
  const [forwarded, setForwarded] = useState("Yet to Forwarded")
  const [type, setType] = useState("");
  let [isActives, setIsActives] = useState(null)


  // Correspondence
  let [previous, setPrevious] = useState("")
  let [next, setNext] = useState("")
  let [correspondence, setCorrespondence] = useState([])
  let [stop, setStop] = useState(true)
  let [letterno, setletterno] = useState("")
  let [ack, setAck] = useState("Yet to Upload")
  const [contacts, setContacts] = useState([]); // State to hold contact data


  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.put(`${baseurl}/contact/all`); // Adjust API endpoint if necessary
        setContacts(response.data); // Set the fetched contact data in the state
      } catch (error) {
        console.error('Error fetching contact:', error);
      }
    };

    fetchContacts();
  }, []);


  const handleFileChange = async (event) => {
    const files = event.target.files;
    const newSelectedFiles = [];
    let newarr = []
    setStop(false)
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file) {
        // Read file extension
        const fileExtension = file.name;
        setSelectedFile(file);
        setFileExtension(fileExtension);

        const arr1 = await triggerFunction(fileExtension, (projectname).trim());
        // key=arr1[0]
        // url=arr1[1]
        // setKey(arr1[0])
        // setUrl(arr1[1])
        newarr.push([arr1[0], arr1[1], file])
      }
      setStop(true)
      //////console.log(newarr)
      setSelectedFiles([...selectedFiles, ...newarr]);
    }
  };

  const handleFileChange2 = async (event) => {
    const files = event.target.files;
    const newSelectedFiles = [];
    let newar = []
    setStop(false)
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file) {
        // Read file extension
        const fileExtension = file.name;
        setSelectedFile(file);
        setFileExtension(fileExtension);

        const arr1 = await triggerFunction(fileExtension, (projectname).trim());
        // key=arr1[0]
        // url=arr1[1]
        // setKey(arr1[0])
        // setUrl(arr1[1])
        newar.push([arr1[0], arr1[1], file])
      }
      setStop(true)
      //////console.log(newar)
      setSelectedFilesack([...selectedFilesack, ...newar]);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();

    let body = {
      project: pname,
      subject: tasksubject,
      description: taskdescription,
      letterno: letterno,
      from: form,
      to: to,
      date: createdate,
      acknowledgement: ack,
      forwarded: forwarded,
      type: type,
      file: selectedFiles.length !== 0 ? selectedFiles : [], // Set to empty array if no files
      file1: selectedFilesack.length !== 0 ? selectedFilesack : [] // Set to empty array if no ack files
    };

    //////console.log(body);

    dispatch(addcorrespondence(body))
      .then(() => {
        // Handle success
      })
      .catch((error) => {
        //////console.log(error);
      });
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
    dispatch(getcorrespondence()).then((resp) => {
      setCorrespondence(resp)
      //////console.log(resp)
      // ////////console.log(resp)
    }).catch(error => {
      //////console.log(error)
    })
    dispatch(fetchProjects({
      company: companyname ? companyname : null,
      status: isActive ? isActive : null
    })).then((resp) => {
      setPnamearr(resp)
      // ////////console.log(resp)
    }).catch(error => {

    })


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






  const findprojectname = (id) => {
    //////////////////console.log(id,pnamearr)
    for (let i = 0; i < pnamearr.length; i++) {
      if (pnamearr[i]._id === id) {
        projectname = pnamearr[i].name
        setprojectname(pnamearr[i].name)
        //////console.log(projectname)
        break
      }
    }
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

  // redirect to projects page
  const handleRedirect = (id) => {
    history.push(`/projects/${id}`)
  }

  const handleCheckboxChange = (value) => {
    if (ack === value) {
      // If the current checkbox is unchecked, revert to "Yet to Upload"
      setAck("Yet to Upload");
    } else {
      // Set the selected value ("Not Required" or "Uploaded")
      setAck(value);
    }
  };



  const handleCheckboxChange1 = () => {
    if (forwarded === "Yet to Upload") {
      setForwarded("Not Required");
    } else {
      setForwarded("Yet to Forwarded");
    }
  };


  let startIndex = currentPage * itemsPerPage;
  let endIndex = (currentPage + 1) * itemsPerPage;
  let currentItems = data.slice(startIndex, endIndex);


  return (
    <>
      <ToastContainer />
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
              Create Correspondence
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="home" className="py-4">
            <section className="d-flex align-items-center my-2 mt-lg-3 mb-lg-5">
              <Container>
                <form onSubmit={(e) => handleUpload(e)}>
                  <Row>
                    {/* Company Name */}
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
                    {/* Project Status */}
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
                            {ProjectStatus.map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    {/* From */}
                    <Col xs={12} md={6}>
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>From</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Select
                            value={form}
                            onChange={(e) => {
                              setForm(e.target.value);
                            }}
                          >
                            <option value="">Select Option</option>
                            {contacts
                              .sort((a, b) => a.name.localeCompare(b.name))
                              // .filter((contact) => contact.type === 'Developer')
                              .map((contact, index) => (
                                <option key={index} value={contact.name}>
                                  {contact.name}
                                </option>
                              ))}
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>To</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Select
                            value={to}
                            onChange={(e) => {
                              setTo(e.target.value);
                            }}
                          >
                            <option value="">Select Option</option>
                            {contacts
                              .sort((a, b) => a.name.localeCompare(b.name))
                              // .filter((contact) => contact.type === 'Agent')
                              .map((contact, index) => (
                                <option key={index} value={contact.name}>
                                  {contact.name}
                                </option>
                              ))}
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    {/* Date */}
                    <Col xs={12} md={6}>
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>Date</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Control
                            
                            required
                            type="date"
                            placeholder="Amount"
                            value={createdate}
                            onChange={(e) => setCreateDate(e.target.value)}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    {/* Project Name */}
                    <Col xs={12} md={6}>
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>Project Name</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Select value={pname} onChange={(e) => {
                            setPname(e.target.value)
                            findprojectname(e.target.value)
                          }}>
                            <option value="">Select Option</option>
                            {pnamearr && pnamearr.map((option, index) => (
                              <option key={index} value={option._id}>{option.name}</option>
                            ))}
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    {/* Letter No */}
                    <Col xs={12} md={6}>
                      <Form.Group id="tasksubject" className="mb-4">
                        <Form.Label>Letter No</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Control  type="text" placeholder="Task Subject" value={letterno} onChange={(e) => setletterno(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    {/* Subject */}
                    <Col xs={12} md={6}>
                      <Form.Group id="tasksubject" className="mb-4">
                        <Form.Label>Subject</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Control  type="text" placeholder="Task Subject" value={tasksubject} onChange={(e) => setTaskSubject(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Row>
                      {/* Description */}
                      <Col xs={12} md={6}>
                        <Form.Group id="Taskdescription" className="mb-4">
                          <Form.Label>Description</Form.Label>
                          <InputGroup>
                            <textarea  rows="2" cols="60" type="textarea" placeholder="Task Description" value={taskdescription} onChange={(e) => setTaskdescription(e.target.value)} />
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      <Col xs={2} md={3}>
                        <Form.Group id="forwarded" className="mb-4">
                          <Form.Label>Forward</Form.Label>
                          <InputGroup>
                            <Form.Check
                              type="checkbox"
                              label="Not Required"
                              checked={forwarded === "Not Required"}
                              onChange={handleCheckboxChange1}
                            />
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      <Col xs={2} md={3}>
                        <Form.Group id="taskstatus" className="mb-4">
                          <Form.Label>Acknowledgement</Form.Label>
                          <div className="mb-2">
                            <Form.Check
                              type="checkbox"
                              label="Not Required"
                              checked={ack === "Not Required"}
                              onChange={() => handleCheckboxChange("Not Required")}
                            />
                          </div>
                          <div>
                            <Form.Check
                              type="checkbox"
                              label="Uploaded"
                              checked={ack === "Uploaded"}
                              onChange={() => handleCheckboxChange("Uploaded")}
                            />
                          </div>
                        </Form.Group>
                      </Col>

                      <Col>
                        <Form.Group className="mb-3" controlId="editDescription">
                          <Form.Label>Type</Form.Label>
                          <Form.Select required value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="">Select Option</option>
                            {Type.map((type, index) => (
                              <option key={index} value={type} >
                                {type}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      {/* {(!forwarded || forwarded !== "Not Required") && ( */}
                      {/* <> */}
                      {/* File Upload */}
                      <Col xs={12} md={6}>
                        <Form.Group id="Project Image" className="mb-4">
                          <Form.Label>File if Required</Form.Label>
                          <InputGroup>
                            <InputGroup.Text></InputGroup.Text>
                            <Form.Control
                              type="file"
                              onChange={handleFileChange}
                              placeholder="Upload Image"
                            />
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      {/* </> */}
                      {/* )} */}

                      {ack === "Uploaded" && (
                        <>
                          {/* Acknowledgement File Upload */}
                          <Col xs={12} md={6}>
                            <Form.Group id="Project Image" className="mb-4">
                              <Form.Label>Acknowledgement File if Required</Form.Label>
                              <InputGroup>
                                <InputGroup.Text></InputGroup.Text>
                                <Form.Control
                                  type="file"
                                  onChange={handleFileChange2}
                                  placeholder="Upload Image"
                                />
                              </InputGroup>
                            </Form.Group>
                          </Col>
                        </>
                      )}
                    </Row>
                    {/* Submit Button */}
                    <Col className="d-flex justify-content-center">
                      {stop && (
                        <Button variant="primary" type="submit" className="w-100 mt-3">
                          Submit
                        </Button>
                      )}
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
