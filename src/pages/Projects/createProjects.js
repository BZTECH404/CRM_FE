import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, SplitButton, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';
import { baseurl, ProjectStatus, wards, companies } from "../../api";
import { useSelector, useDispatch } from 'react-redux';
import { triggerFunction, getPredefinedUrl } from '../../components/SignedUrl';
import { useHistory, useParams, Link } from 'react-router-dom';
import { fetchProjects } from "../../features/projectslice";
import Multiselect from "../../components/Multiselect";
import { check, timeinIndia } from '../../checkloggedin.js';
import { Dropdown } from 'react-bootstrap';
import History from "./History.js";
import TasksView from "./TasksView.js";
const Comp = () => {

  // common for all
  const [projectName, setProjectName] = useState('');
  const [developer, setDeveloper] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [area, setArea] = useState(0)
  const [company, setCompany] = useState('')
  const [pstage, setpstage] = useState('')
  const [imageUrl, setImageUrl] = useState(null);
  const [isActive, setIsActive] = useState('false');
  let [companyname, setCompanyName] = useState("")
  let [developerName, setDeveloperName] = useState("")
  const [contacts, setContacts] = useState([]); // State to hold contact data
  let [agentName, setAgentName] = useState("")
  let [feactive, setfeactive] = useState("")
  const [users, setUsers] = useState([])
  const [selectedusers, setSelectedusers] = useState([])
  const [currentPage, setCurrentPage] = useState(0);
  const [clickedImage, setClickedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const itemsPerPage = 5; //Define itemsPerPage
  const [editProjectId, setEditProjectId] = useState('');
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectType, setEditProjectType] = useState('');
  const [editProjectStage, setEditProjectStage] = useState('');
  const [editProjectStatus, setEditProjectStatus] = useState('')
  const [editDeveloper, setEditDeveloper] = useState('');
  const [editProjectDescription, setEditProjectDescription] = useState('');
  const [editArea, setEditArea] = useState(null);
  const [editimageUrl, setEditImageUrl] = useState(null);
  const [editselectedusers, setEditSelectedusers] = useState([])
  const [addimage, setAddImage] = useState(false)
  const [editcts, setEditcts] = useState("")
  const [ptype, setPtype] = useState('');
  const [arr, setArr] = useState([]);
  const [pstatus, setPstatus] = useState('')
  const [key, setKey] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileExtension, setFileExtension] = useState('');
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [folderName, setFolderName] = useState(''); // State for folder name
  const [folders, setFolders] = useState([]); // State for storing folder names
  const [url, setUrl] = useState('');
  const [project, setProject] = useState(null)
  const { id: projectId } = useParams();
  const [people, setPeople] = useState([])
  const [filename, setfilename] = useState('')
  const [findata, setfindata] = useState([])
  let [createdoption, setCreatedoption] = useState(0)
  let [editCompany, setEditCompany] = useState('');
  let [stop, setstop] = useState(true)
  let [editward, setEditWard] = useState("")
  let [ward, setWard] = useState("")
  let [cts, setCts] = useState("")
  let [data, setData] = useState([]);
  let [regu, setregu] = useState("")
  let [isDisabled, setIsDisabled] = useState(false)
  let history = useHistory();
  const dispatch = useDispatch();
  const inputRef = useRef(null);




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
    const file = event.target.files[0];
    setstop(false)
    if (file) {
      // Read file extension
      const fileExtension = file.name;
      setSelectedFile(file);
      setFileExtension(fileExtension);
      let arr1 = await triggerFunction(fileExtension, (folderName).trim())
      //////////////////////console.log(arr1)
      setUrl(arr1[0]); // Update URL with folderName
      setKey(arr1[1])
      setIsFileSelected(true); // Enable upload button
    } else {
      setSelectedFile(null);
      setFileExtension('');
      setIsFileSelected(false); // Disable upload button
    }
    setstop(true)
  };

  const handleUpload = () => {

    // s3
    const token = localStorage.getItem('token');
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileContent = event.target.result;
        // Perform your upload logic here
        // For demonstration, let's just log the file extension and content
        //////////////////////console.log('Selected File Extension:', fileExtension);
        //////////////////////console.log('File Content:', fileContent);

        try {
          // Example: Uploading file content using Fetch
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

          //////////////////////console.log('File uploaded successfully:', responseFile);
        } catch (error) {
          //console.error('Error:', error);
          toast.error('Failed to add image'); // Display error toast if addition fails
        }
      }

      reader.readAsArrayBuffer(selectedFile);
    }
    // backend
    (async () => {
      try {
        let objid = [];
        for (let i = 0; i < selectedusers.length; i++) {
          //////////////////////console.log(selectedusers[i]);
          objid.push(selectedusers[i].id);
        }
        //////////////////////console.log(objid);

        let body = {
          name: projectName,
          type: ptype,
          status: pstatus,
          stage: pstage,
          description: projectDescription,
          area: area,
          // imageUrl: getPredefinedUrl(key),
          users: objid,
          company: companyname,
          developer: developerName,
          agent: agentName,
        };

        const responseFormData = await axios.post(`${baseurl}/project/create`, body);
        //////////////////////console.log(responseFormData);
        toast.success('Image added successfully'); // Call toast.success after successful addition


        // Clear form data after submission
      } catch (error) {
        //console.error('mongo db error', error);
        toast.error('Failed to add image'); // Display error toast if addition fails
      }
    })();

  };

  ////////////////////////////////////////////
  //For Type
  useEffect(() => {
    //////console.log(check())
    // Set the value of arr using some asynchronous operation or any other logic
    const fetchOptions = async () => {
      try {
        // Example asynchronous operation fetching data
        // const response = await fetch('your/api/endpoint');
        // const data = await response.json();
        // // Assuming the data received is an array of options
        const arr = ["Personal", "Coding", "Branding", "Reg 30B", "33(1)", ...Array.from({ length: 31 }, (_, i) => `33(${i + 1})`)];
        setArr(arr);


      } catch (error) {
        //console.error('Error fetching options:', error);
      }
    };

    // Call the fetchOptions function to set the value of arr
    fetchOptions();
  }, []);

  const handleImagesUpload = (event) => {
    const image = event.target.files[0];
    setImageUrl(image);
  }

  const handleDelete = (id) => {
    //////////////////////console.log(id)
    const token = localStorage.getItem('token');

    axios.delete(`${baseurl}/project/${id}`, {
      headers: {
        Authorization: `${token}`
      }
    })
      .then(response => {
        //////////////////////console.log('Record deleted successfully:', response.data);
        setData(prevData => prevData.filter(item => item.id !== id));
        toast.success('Record deleted successfully'); // Display success toast
        window.location.reload()
      })
      .catch(error => {
        //console.error('Error deleting record:', error);
        toast.error('Failed to delete record'); // Display error toast
      });
  }
  // Calculate the index of the first item to display based on the current page and items per page

  const handleprojectFetch = async (e) => {
    // //////console.log(companyname)
    let companyFilter = companyname == "None of the Above" ? "-" : companyname;
    // //////console.log(companyFilter,"fileter")
    dispatch(fetchProjects({
      company: companyFilter,
      status: feactive ? feactive : null,
      isDisabled: isDisabled === 'true' ? true : false,
      type: regu ? regu : null,
      people: people ? people : null
    }))
      .then((resp) => {
        data = resp
        setData(resp);
        setfindata(resp)

        const scrollY = sessionStorage.getItem("scrollPosition");
        if (scrollY !== null) {
          window.scrollTo(0, parseInt(scrollY));
        }

      })
      .catch(error => {
        // Handle the error appropriately
        console.error("Error fetching projects:", error);
      });
  }


  useEffect(() => {
    //get Projects
    //////console.log(isDisabled)

    handleprojectFetch()
    // get Users
    axios.get(`${baseurl}/user/`)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        //////////////////////console.log(error);
      });

  }, []);


  const handleEditModal = (item) => {
    //////console.log(item)
    const scrollY = window.scrollY;
    sessionStorage.setItem("scrollPosition", scrollY);


    let temp = []
    let tempuser = item.users
    for (let j = 0; j < users.length; j++) {
      if ((tempuser).includes(users[j]._id)) {
        temp.push({
          id: users[j]._id,
          name: users[j].username,
        })
      }
    }
    //////////////////////console.log(temp,"hi")
    setEditProjectId(item._id)
    setFolderName(item.name)
    setEditSelectedusers(temp)
    setEditProjectStage(item.stage)
    setEditProjectName(item.name)
    setEditCompany(item.company)
    setEditProjectType(item.type)
    setEditProjectStatus(item.status)
    setEditDeveloper(item.developer)
    setEditProjectDescription(item.description)
    setEditArea(item.area)
    setClickedImage(item.imageUrl)
    setEditWard(item.ward)
    setEditcts(item.cts)
    setShowModal(true);
    setEditMode(true); // Set editMode to true when opening the edit modal
  }


  const handleEditSubmit = async (e) => {
    // s3
    e.preventDefault()

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileContent = event.target.result;
        // Perform your upload logic here
        // For demonstration, let's just log the file extension and content
        //////////////////////console.log('Selected File Extension:', fileExtension);
        //////////////////////console.log('File Content:', fileContent);

        try {
          // Example: Uploading file content using Fetch
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
          toast.success("File Uploaded Successfully")
          // //////console.log('File uploaded successfully:', responseFile);
        } catch (error) {
          //console.error('Error:', error);
          toast.error('Failed to add image'); // Display error toast if addition fails
        }
      }

      reader.readAsArrayBuffer(selectedFile);
    }




    //////////////////////console.log("try")
    const token = localStorage.getItem('token');
    //////////////////////console.log(users)
    let temp = []
    for (let i = 0; i < editselectedusers.length; i++) {
      temp.push(editselectedusers[i].id)
    }
    //////////////////////console.log(temp)
    //////console.log(editward)
    const editData = {
      name: editProjectName,
      status: editProjectStatus,
      type: editProjectType,
      developer: editDeveloper,
      description: editProjectDescription,
      area: editArea,
      company: editCompany,
      stage: editProjectStage,
      imageUrl: addimage && isFileSelected ? getPredefinedUrl(key) : clickedImage,
      users: temp,
      ward: editward,
      cts: editcts

    };
    //////////////////////console.log(clickedImage)


    try {
      //////////////////////console.log(editselectedusers)
      const response = await axios.put(`${baseurl}/project/${editProjectId}`, editData, {
        headers: {
          Authorization: `${token}`
        }
      });
      // //////////////////////console.log('Updated data:', response.data);
      toast.success('Data updated successfully');
      setShowModal(false);
      handleprojectFetch()
      // window.location.reload()
      // setData(prevData => prevData.map(item => item._id === editItemId ? { ...item, ...editData } : item));
    } catch (error) {
      //console.error('Error updating record:', error);
      toast.error('Failed to update record');
    }
  }

  // redirect to projects page
  const handleRedirect = (id) => {
    history.push(`/projects/${id}`)
  }
  const getUsernameById = (assignTaskTo) => {
    let str = "";
    for (let i = 0; i < assignTaskTo.length; i++) {
      for (let j = 0; j < users.length; j++) {
        if (users[j]._id === assignTaskTo[i]) {
          str = str + users[j].username + " ";
          break;
        }
      }
    }
    return str;
  };

  const sortbycreatedby = () => {
    // Increment the createdoption to toggle through sorting states
    let temp = createdoption + 1;
    if (temp > 2) {
      temp = 1; // Reset to 1 if it exceeds the number of sorting options
    }
    setCreatedoption(temp);

    // Make a copy of the data array to avoid mutating the state directly
    let sortedData = [...data]; // Ensure corr is the state being rendered

    // Sort the data based on created date
    if (temp === 1) {
      // Ascending order: Oldest first
      sortedData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (temp === 2) {
      // Descending order: Newest first
      sortedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setData(sortedData); // Update the state with the sorted data
  };

  // let startIndex = currentPage * itemsPerPage;
  // let endIndex = (currentPage + 1) * itemsPerPage;
  // let currentItems = data.slice(startIndex, endIndex);

  const handleFilter = () => {

    const regex = new RegExp(filename, 'i');

    let filtered = (data.filter((item) =>
      (companyname === "" || item.company === companyname) &&
      (regu === "" || item.type === regu) &&
      (feactive === "" || item.status === feactive) &&
      (isDisabled === "" || item.isDisabled === (isDisabled === "true")) &&
      (people.every(person => item.users.includes(person.id))) &&
      regex.test(item.name)))

    //   )))

    console.log(filtered)
    setfindata(filtered)

    // console.log("expenseInvoices ==> ", expenseInvoices);

  }
  const ProjectFiter = () => {
    return (
      <Row>
        {/* Searching */}
   
        <Col xs={12} md={4}>
          <Form.Group id="cname" className="mb-4">
            <Form.Label>Company Name</Form.Label>
            <InputGroup>
              <InputGroup.Text></InputGroup.Text>
              <Form.Select required value={companyname} onChange={(e) => {
                setCompanyName(e.target.value)
                // handleprojectFetch()
                // //////console.log(e.target.value)
              }}>
                <option value="">Select Option</option>
                {companies.map((company, index) => (
                  <option key={index} value={company}>
                    {company}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col xs={12} md={4}>
          <Form.Group id="cname" className="mb-4">
            <Form.Label>Regulation</Form.Label>
            <InputGroup>
              <InputGroup.Text></InputGroup.Text>
              <Form.Select value={regu} onChange={(e) => {
                regu = e.target.value
                setregu(e.target.value);
                // handleprojectFetch();
              }}>
                <option value="">Select Option</option>
                {/* Mapping through the arr array to generate options */}
                {arr.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </Form.Select>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col xs={12} md={4}>
          <Form.Group id="taskstatus" className="mb-4">
            <Form.Label>Project Status</Form.Label>
            <InputGroup>
              <InputGroup.Text></InputGroup.Text>
              <Form.Select value={feactive} onChange={(e) => {
                feactive = e.target.value
                setfeactive(e.target.value);
                // handleprojectFetch();
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
        <Col xs={12} md={4}>
          <Form.Group className="mb-3" controlId="editIsActive">
            {users ? (<Multiselect
              selectedValues={people}
              setSelectedValues={setPeople}
              options={users} />) : (
              <p>loading</p>
            )}
          </Form.Group>
        </Col>
        <Col xs={12} md={4}>
          {check()[1] == 'john_doe' ? (<Form.Group id="taskstatus" className="mb-4">
            <Form.Label>isDisabled</Form.Label>
            <InputGroup>
              <InputGroup.Text></InputGroup.Text>
              <Form.Select value={isDisabled} onChange={(e) => {
                isDisabled = e.target.value
                setIsDisabled(e.target.value);
              }}>
                <option value="">Select Option</option>
                <option value={true}>True</option>
                <option value={false}>False</option>
              </Form.Select>
            </InputGroup>
          </Form.Group>) : (<p>{check()[1]}</p>)}
        </Col>
        <Col xs={12} md={4}>
          <>
            {/* <Form.Group id="taskstatus" className="mb-4"> */}
            <Form.Label>Search</Form.Label>
            <Form.Group controlId="editFileName">
              <Form.Control
                ref={inputRef}
                required
                type="text"
                placeholder="File Name or Date"
                value={filename}
                onChange={(e) => {
                  setfilename(e.target.value)
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
        <Col xs={12} md={4} className="d-flex justify-content-center">
          <Button onClick={(e) => {
            e.preventDefault()
            // handleprojectFetch()
            handleFilter()
          }} style={{ height: "70px" }} variant="primary" type="submit" className="w-100 mt-3">
            Submit
          </Button>
        </Col>
      </Row>
    )
  }


  return (
    <>
      <ToastContainer />
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-2">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Projects</Breadcrumb.Item>
            <Breadcrumb.Item active>Create Projects</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Tab.Container defaultActiveKey="home">
        <Nav fill variant="pills" className="flex-column flex-sm-row">
          <Nav.Item>
            <Nav.Link eventKey="Tasks" className="mb-sm-3 mb-md-0">
              Tasks
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="Status" className="mb-sm-3 mb-md-0">
              Status
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="home" className="mb-sm-3 mb-md-0">
              Table
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="profile" className="mb-sm-3 mb-md-0">
              Create Project
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>


          <Tab.Pane eventKey="Tasks" className="py-4">
            {/* <div style={{}}>hi</div> */}
            <TasksView users={users} projects={findata} handleprojectFetch={handleprojectFetch} ProjectFilter={ProjectFiter} />
          </Tab.Pane>



          <Tab.Pane eventKey="Status" className="py-4">
            <section>
              <Container>
                <Row>
                  {/* Searching */}
                  <ProjectFiter />
                  <Col xs={12}
                    className="mx-auto">
                    <Card
                    // style={{ marginLeft: "-5%", width: 'max-content', zIndex: "7" }} border="light" className="shadow-sm"
                    >
                      <Card.Header>
                        <Row className="align-items-center">
                          <Col>
                            <h5>Service List</h5>
                          </Col>
                          <Col className="text-end">
                            <Button variant="secondary" size="sm">See all</Button>
                          </Col>
                        </Row>
                      </Card.Header>
                      <Table responsive className="align-items-center table-flush">
                        <thead className="thead-light">
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col" onClick={sortbycreatedby}>Date</th>
                            <th scope="col">Project Name</th>
                            <th scope="col">Project Status</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {data.slice(startIndex, endIndex).map((row, index) => ( */}
                          {findata && findata.map((row, index) => (
                            <tr key={index}>
                              {/* <td style={{ maxWidth: "10px", cursor: "pointer" }} onClick={()=>handleRedirect(row._id)}>{startIndex + index + 1}</td> */}

                              <td style={{ border: "1px solid black", width: "10px", cursor: "pointer" }} onClick={() => handlegreyirect(row._id)}>{index + 1}</td>
                              <td style={{ border: "1px solid black", width: "10px", cursor: "pointer", whiteSpace: "pre-wrap" }}>
                                {new Date(row.createdAt).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric' // 4-digit year
                                })}
                              </td>
                              <td style={{ border: "1px solid black", maxWidth: "20px", width: "1px", cursor: "pointer", whiteSpace: "pre-wrap" }}>
                                <Link
                                  to={`/projects/${row._id}`}
                                  style={{ color: 'blue', textDecoration: 'underline' }}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {row.name}
                                </Link>
                              </td>
                              <td
                                style={{
                                  border: "1px solid black",
                                  width: "600px",
                                  fontSize: "18px",

                                  cursor: "pointer",
                                  whiteSpace: "pre-wrap",
                                  textAlign: "left"
                                }}
                              >
                                {row.stories
                                  ?.slice() // Creates a new copy to prevent mutation
                                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                                  .filter(story => story.isDisabled === false)
                                  .map((story, index) => (
                                    index < 4 ? (
                                      <>
                                        <div style={{ fontSize: "15px", textDecoration: "underline", color: "blue" }}>{timeinIndia(story.date)}</div>
                                        <div style={{ border: "1px solid black", marginBottom: "5px", borderRadius: "5px", fontWeight: "bolder", }} key={story._id}>{story.storyText}</div>
                                      </>
                                    ) : null
                                  ))
                                }
                              </td>
                              <td
                                style={{
                                  border: "1px solid black",
                                  width: "10px",
                                  fontSize: "18px",
                                  textAlign: "left"
                                  // fontWeight: "bolder",
                                  // cursor: "pointer",
                                  // whiteSpace: "pre-wrap",
                                }}

                              >
                                <Button onClick={() => {
                                  const scrollY = window.scrollY;

                                  sessionStorage.setItem("scrollPosition", scrollY);
                                  setProject(row)
                                  setShowModal1(true)
                                }}>View all</Button>

                              </td>
                            </tr>
                          ))}
                        </tbody>
                        {/* <tfoot>
                          <tr>
                            <td colSpan="8">
                              <div className="d-flex justify-content-center mt-3">
                                <Button
                                  variant="light"
                                  disabled={currentPage === 0}
                                  onClick={() => handlePageChange(currentPage - 1)}
                                  className="me-2"
                                >
                                  <FontAwesomeIcon icon={faAngleLeft} />
                                </Button>
                                <Button
                                  variant="light"
                                  disabled={currentItems.length < itemsPerPage}
                                  onClick={() => handlePageChange(currentPage + 1)}
                                  className="ms-2"
                                >
                                  <FontAwesomeIcon icon={faAngleRight} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </tfoot> */}
                      </Table>
                      <Modal
                        style={{ overflowX: "scroll" }}
                        show={showModal1}
                        onHide={() => {
                          setShowModal1(false);

                          handleprojectFetch();
                          setTimeout(() => {
                            const scrollY = sessionStorage.getItem("scrollPosition");
                            ;
                            if (scrollY !== null) {
                              window.scrollTo(0, parseInt(scrollY));
                            }
                          }, 100);
                        }}
                      >
                        <Modal.Header>
                          <Modal.Title>Project History</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          {/* jo */}
                          <History project={project} />
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={() => {
                            setShowModal1(false)
                            handleprojectFetch()
                          }}>
                            Cancel
                          </Button>
                        </Modal.Footer>
                      </Modal>

                    </Card>
                  </Col>
                </Row>
              </Container>
            </section>

          </Tab.Pane>
          <Tab.Pane eventKey="home" className="py-4">
            <section>
              <Container>
                {/* Searching */}
                <ProjectFiter />

                <Row>
                  {/* Searching */}

                  <Col className="mx-auto">
                    <Card style={{ marginLeft: "-5%", width: 'max-content' }} border="light" className="shadow-sm">
                      <Card.Header>
                        <Row className="align-items-center">
                          <Col>
                            <h5>Service List</h5>
                          </Col>
                          <Col className="text-end">
                            <Button variant="secondary" size="sm">See all</Button>
                          </Col>
                        </Row>
                      </Card.Header>
                      <Table responsive className="align-items-center table-flush">
                        <thead className="thead-light">
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col" onClick={sortbycreatedby}>Date</th>
                            <th scope="col">Project Name</th>
                            <th scope="col">Regulation</th>
                            <th scope="col">People</th>
                            <th scope="col">Ward</th>
                            <th scope="col">CTS</th>
                            <th scope="col">Type</th>
                            <th scope="col">Developer</th>
                            <th scope="col">Agent</th>
                            <th scope="col">Appointment letter</th>
                            <th scope="col">Area</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {data.slice(startIndex, endIndex).map((row, index) => ( */}
                          {findata && findata.map((row, index) => (
                            <tr key={index}>
                              {/* <td style={{ maxWidth: "10px", cursor: "pointer" }} onClick={()=>handleRedirect(row._id)}>{startIndex + index + 1}</td> */}

                              <td style={{ border: "1px solid black", width: "1.1px", cursor: "pointer" }} onClick={() => handlegreyirect(row._id)}>{index + 1}</td>
                              <td style={{ border: "1px solid black", width: "10px", cursor: "pointer", whiteSpace: "pre-wrap" }}>
                                {new Date(row.createdAt).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric' // 4-digit year
                                })}
                              </td>
                              <td style={{ border: "1px solid black", maxWidth: "20px", width: "1px", cursor: "pointer", whiteSpace: "pre-wrap" }}>
                                <Link
                                  to={`/projects/${row._id}`}
                                  style={{ color: 'blue', textDecoration: 'underline' }}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {row.name}
                                </Link>
                              </td>
                              <td style={{ border: "1px solid black", maxWidth: "20px", width: "1px", cursor: "pointer", whiteSpace: "pre-wrap" }} >{row.type}</td>

                              <td style={{ border: "1px solid black", maxWidth: "20px", width: "1px", cursor: "pointer", whiteSpace: "pre-wrap" }} >{getUsernameById(row.users)}</td>
                              <td style={{ border: "1px solid black", maxWidth: "20px", width: "1px", cursor: "pointer", whiteSpace: "pre-wrap" }}>{row.ward}</td>
                              <td style={{ border: "1px solid black", maxWidth: "20px", width: "1px", cursor: "pointer", whiteSpace: "pre-wrap" }}>{row.cts}</td>


                              <td style={{ border: "1px solid black", maxWidth: "20px", width: "1px", cursor: "pointer" }}>{row.type}</td>
                              <td style={{ border: "1px solid black", maxWidth: "20px", width: "1px", cursor: "pointer", whiteSpace: "pre-wrap" }}>{row.developer}</td>
                              <td style={{ border: "1px solid black", maxWidth: "20px", width: "1px", cursor: "pointer", whiteSpace: "pre-wrap" }}>{row.agent}</td>
                              {/* <td>  
                                {row.imageUrl && (
                                  <img
                                    src={row.imageUrl}
                                    alt="Service Image"
                                    style={{ maxWidth: "1px", cursor: "pointer" }}
                                    onClick={() => handleImageClick(row.imageUrl)}
                                  />
                                )}
                              </td> */}
                              {/* href={(row.urls[0])?.file} */}
                              {/* {(row.urls[0])?.name} */}
                              <td style={{ border: "1px solid black", maxWidth: "20px", width: "1px", cursor: "pointer", whiteSpace: "pre-wrap" }}  ><pre style={{ whiteSpace: "pre-wrap" }}><a download href={row.imageUrl} style={{ cursor: "pointer", whiteSpace: "pre-wrap", textDecoration: "underline", color: "blue" }}>{row.imageUrl == "https://officecrm560.s3.ap-south-1.amazonaws.com/" || row.imageUrl == null ? (null) : (<p>-Appointment Letter</p>)}</a></pre></td>
                              <td style={{ border: "1px solid black", maxWidth: "20px", width: "1px", cursor: "pointer", whiteSpace: "pre-wrap" }} >{row.area}</td>
                              <td style={{ border: "1px solid black", maxWidth: "1px" }}>
                                <Button variant="info" size="sm" onClick={() => handleEditModal(row)}>
                                  <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(row._id)}>
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        {/* <tfoot>
                          <tr>
                            <td colSpan="8">
                              <div className="d-flex justify-content-center mt-3">
                                <Button
                                  variant="light"
                                  disabled={currentPage === 0}
                                  onClick={() => handlePageChange(currentPage - 1)}
                                  className="me-2"
                                >
                                  <FontAwesomeIcon icon={faAngleLeft} />
                                </Button>
                                <Button
                                  variant="light"
                                  disabled={currentItems.length < itemsPerPage}
                                  onClick={() => handlePageChange(currentPage + 1)}
                                  className="ms-2"
                                >
                                  <FontAwesomeIcon icon={faAngleRight} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </tfoot> */}
                      </Table>
                      <Modal show={showModal && editMode} onHide={() => {
                        setEditMode(false)
                        setTimeout(() => {
                          const scrollY = sessionStorage.getItem("scrollPosition");
                          if (scrollY !== null) {
                            window.scrollTo(0, parseInt(scrollY));
                          }
                        }, 100);
                      }}>
                        <Modal.Header>
                          <Modal.Title>Edit Project</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form>
                            <Form.Group className="mb-3" controlId="editHeading">
                              <Form.Label>ProjectName</Form.Label>
                              <Form.Control type="text" value={editProjectName} onChange={(e) => setEditProjectName(e.target.value)} />

                              <Form.Group className="mb-3" controlId="editDescription">
                                <Form.Label>Project Type</Form.Label>
                                <Form.Select required value={editProjectType} onChange={(e) => setEditProjectType(e.target.value)}>
                                  <option value="">Select Option</option>
                                  {/* Mapping through the arr array to generate options */}
                                  {arr.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                              <Form.Group className="mb-3" controlId="editDescription">
                                <Form.Label>Company Name</Form.Label>
                                <Form.Select required value={editCompany} onChange={(e) => setEditCompany(e.target.value)}>
                                  <option value="">Select Option</option>
                                  {companies.map((company, index) => (
                                    <option key={index} value={company}>
                                      {company}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                              {/* Ward */}
                              <Form.Group className="mb-3" controlId="editDescription">
                                <Form.Label>Ward</Form.Label>
                                <Form.Select required value={editward} onChange={(e) => {
                                  //////console.log(e.target.value)
                                  setEditWard(e.target.value)
                                }}>
                                  <option value="">Select Option</option>
                                  {wards.map((option) => (
                                    <option value={option}>{option}</option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                              {/* CTS */}
                              <Form.Group className="mb-3" controlId="editHeading">
                                <Form.Label>CTS</Form.Label>
                                <Form.Control type="text" value={editcts} onChange={(e) => setEditcts(e.target.value)} />
                              </Form.Group>

                              {/*  */}
                              <Form.Group className="mb-3" controlId="editHeading">
                                <Form.Label>Project Stage</Form.Label>
                                <Form.Control type="text" value={editProjectStage} onChange={(e) => setEditProjectStage(e.target.value)} />
                              </Form.Group>
                              <Form.Group className="mb-3" controlId="editDescription">
                                <Form.Label>Project Status</Form.Label>
                                <Form.Select required value={editProjectStatus} onChange={(e) => setEditProjectStatus(e.target.value)}>
                                  <option value="">Select Option</option>
                                  {/* Mapping through the arr array to generate options */}
                                  {ProjectStatus.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                  ))}
                                </Form.Select>
                              </Form.Group>

                              <Form.Group className="mb-3" controlId="editHeading">
                                <Form.Label>Developer</Form.Label>
                                <Form.Control type="text" value={editDeveloper} onChange={(e) => setEditDeveloper(e.target.value)} />
                              </Form.Group>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editHeading">
                              <Form.Label>Project Description</Form.Label>
                              <textarea rows="4" cols="60" type="text" value={editProjectDescription} onChange={(e) => setEditProjectDescription(e.target.value)} />
                            </Form.Group>


                            <Form.Group className="mb-3" controlId="editHeading">
                              <Form.Label>Area</Form.Label>
                              <Form.Control type="text" value={editArea} onChange={(e) => setEditArea(e.target.value)} />
                            </Form.Group>


                            {/* Select File */}
                            {check()[1] == 'john_doe' ? (

                              <Form.Group className="mb-3" controlId="editIsActive">
                                <Form.Label>Change Document</Form.Label>
                                <Form.Label><a style={{ textDecoration: "underline", color: "blue" }}>{clickedImage}</a></Form.Label>
                                <InputGroup>
                                  <InputGroup.Text>
                                  </InputGroup.Text>
                                  <Button
                                    variant="light"
                                    onClick={() => setAddImage(!addimage)}
                                    className="ms-2"
                                  >Upload New Document</Button>
                                  {addimage ? (
                                    <Form.Control
                                      type="file"
                                      accept="/*"
                                      onChange={handleFileChange}
                                      placeholder="Upload Image"
                                    />) : (null)
                                  }
                                </InputGroup>
                              </Form.Group>
                            ) : null}

                            {/* People */}
                            <Form.Group className="mb-3" controlId="editIsActive">
                              {users ? (<Multiselect
                                selectedValues={editselectedusers}
                                setSelectedValues={setEditSelectedusers}
                                options={users} />) : (
                                <p>loading</p>
                              )}
                            </Form.Group>
                          </Form>

                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={() => setEditMode(false)}>
                            Cancel
                          </Button>
                          {stop ? (<><Col className="d-flex justify-content-end">
                            <Button variant="primary" onClick={(e) => handleEditSubmit(e)}>Submit</Button>
                          </Col></>) : (<></>)}
                        </Modal.Footer>
                      </Modal>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </section>
          </Tab.Pane>
          <Tab.Pane eventKey="profile" className="py-4">
            <section className="d-flex align-items-center my-2 mt-lg-3 mb-lg-5">
              <Container>
                <form onSubmit={handleUpload}>
                  <Row >
                    <Col xs={12} md={6}>
                      <Form.Group id="pName" className="mb-4">
                        <Form.Label>Project Name</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Control required type="text" placeholder="Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                      <Form.Group id="ptype" className="mb-4">
                        <Form.Label>Project type</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Select required value={ptype} onChange={(e) => setPtype(e.target.value)}>
                            <option value="">Select Option</option>
                            {/* Mapping through the arr array to generate options */}
                            {arr.map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="ptype" className="mb-4">
                        <Form.Label>Project Status</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Select required value={pstatus} onChange={(e) => setPstatus(e.target.value)}>
                            <option value="">Select Option</option>
                            {/* Mapping through the arr array to generate options */}
                            {ProjectStatus.map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>
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
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>Developer Name</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Select
                            value={developerName}
                            onChange={(e) => {
                              setDeveloperName(e.target.value);
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
                        <Form.Label>Agent Name</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Select
                            value={agentName}
                            onChange={(e) => {
                              setAgentName(e.target.value);
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
                    <Col xs={12} md={6}>
                      <Form.Group id="ProjectDescription" className="mb-4">
                        <Form.Label>Project Stage</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Control required type="text" placeholder="Stage" value={pstage} onChange={(e) => setpstage(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="ProjectDescription" className="mb-4">
                        <Form.Label>Project Description</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <textarea rows="4" cols="40" required type="text" placeholder="Project Description" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                      <Form.Group id="ProjectName" className="mb-4">
                        <Form.Label>Area in Sqm</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Control required type="number" placeholder="Area" value={area} onChange={(e) => setArea(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    {/* 
                    <Col xs={12} md={6}>
                      <Form.Group id="Project Image" className="mb-2">
                        <Form.Label>Project Image</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            placeholder="Upload Image"
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col> */}
                    <Col xs={12} md={6}>
                      <Form.Group id="ProjectName" className="mb-4">
                        {users ? (<Multiselect
                          selectedValues={selectedusers}
                          setSelectedValues={setSelectedusers}
                          options={users} />) : (
                          <p>loading</p>
                        )}
                      </Form.Group>
                    </Col>

                    <Col className="d-flex justify-content-center"> {/* Centering the submit button */}
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
      {/* <Modal show={showModal && !editMode} onHide={handleCloseModal}>
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
      </Modal> */}
    </>
  );
};

export default Comp
