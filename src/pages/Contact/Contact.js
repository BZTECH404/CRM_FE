import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab , Nav} from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';
import {baseurl} from "../../api";
import {triggerFunction,getPredefinedUrl} from '../../components/SignedUrl';
import { useHistory } from 'react-router-dom';
import {check} from '../../checkloggedin'
import Multiselect from "../../components/Multiselect";
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects } from "../../features/projectslice";





export default () => {

  const [name,setName]=useState('asd')
  const [phone, setPhone] = useState('9820282944');
  const [email, setEmail] = useState('abc@gmail.com');
  const [message, setMessage] = useState('asdasdasd');
  const [projects,setprojects]=useState([])
  const [type,setType]=useState('')
  const [istrue,setistrue]=useState(true)

  const [imageUrl, setImageUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [clickedImage, setClickedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const itemsPerPage = 5; // Define itemsPerPage

  // State variables for edit modal

  let dispatch=useDispatch()

  ////mine
  const [key,setKey]=useState("");
   const [selectedFile, setSelectedFile] = useState(null);
   const [fileExtension, setFileExtension] = useState('');
   const [isFileSelected, setIsFileSelected] = useState(false);
   const [folderName, setFolderName] = useState(''); // State for folder name
   const [folders, setFolders] = useState([]); // State for storing folder names
   const [url, setUrl] = useState('');
   const filepath='../../index.js'

   let history = useHistory();
   // for this file only
  const [users,setUsers]=useState([])
 
  const [pname,setPname]=useState('')
  const [pnamearr,setPnamearr]=useState([])
  const [tasksubject,setTaskSubject]=useState('')
  const [taskdescription,setTaskdescription]=useState('')
  const selectedusers=()=>{

  }
  const token = localStorage.getItem('token');
  // project filtering
  let [isActive, setIsActive] = useState(null);
  let [companyname,setCompanyName]=useState('')
  let [isActives,setIsActives]=useState(null)


  const types=["Developer","Financer","MEP","Structural","Architect","Land Owner","Agent","Miscellaneous Consultant","Society Member"]
  
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Read file extension
      setistrue(false)
      const fileExtension = file.name.split('.').pop();
      setSelectedFile(file);
      setFileExtension(fileExtension);
      let arr1=await triggerFunction(fileExtension, (name).trim())
      setUrl(arr1[0]); // Update URL with folderName
      setKey(arr1[1])
      setIsFileSelected(true); // Enable upload button
      setistrue(true)
    } else {
      setSelectedFile(null);
      setFileExtension('');
      setIsFileSelected(false); // Disable upload button
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    
   
  // api call
  (async () => {

    if (selectedFile != null) {
      // ////////////////console.log("hi",selectedFile)
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileContent = event.target.result;
        // urls.push(getPredefinedUrl(selectedFiles[i][1]))
        // Perform your upload logic here
        // For demonstration, let's just log the file extension and content
        //////////////////////console.log('Selected File Extension:', fileExtension);
        //////////////////////console.log('File Content:', fileContent);

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

            toast.success(`File uploaded succesfully`); // Call toast.success after successful addition
            console.log(responseFile)
            // Reload page after successful submission
            // window.location.reload();

            // Clear form data after submission

          }
        } catch (error) {
          //console.error('Error:', error);
          toast.error('Failed to add image'); // Display error toast if addition fails
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  


    try {
      const ids = projects.map(user => user.id);
      const body = {
        name: name,
        phone: phone,
        email: email,
        type:type,
        description: message,
        projects:ids,
        files:{
          current:selectedFile?getPredefinedUrl(key):null
        }
      };
      ////////////////////console.log(body)
     const response = await axios.post(`${baseurl}/contact/create`, body);
     ////////////////////console.log(response.data)
     setName('')
     setPhone('');
     setEmail('');
    setMessage('');
    setprojects([])
      toast.success('Contact added successfully'); 
    } catch (error) {
      console.error(error);
    }
  })();
  
  };


  ////////////////////////////////////////////

  const handleprojectFetch=async()=>{
    //////////////////////console.log(companyname)
   

    dispatch(fetchProjects({
      company:companyname?companyname:null,
      status:isActive?isActive:null
    })).then((resp)=>{
      setPnamearr(resp)
      // //////////console.log(resp)
    }).catch(error=>{

    })
  }




  //For Fetching Users and Projects
  useEffect(() => {
   //////////////////////console.log(check())
   axios.get(`${baseurl}/user`)
   .then(response => {
     setUsers(response.data);
   })
   .catch(error => {
     //console.error(error);
   });
    

      handleprojectFetch()
      ////////////////////console.log(pnamearr)
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
        //////////////////////console.log('Record deleted successfully:', response.data);
        setData(prevData => prevData.filter(item => item.id !== id));
        toast.success('Record deleted successfully'); // Display success toast
      })
      .catch(error => {
        //console.error('Error deleting record:', error);
        toast.error('Failed to delete record'); // Display error toast
      });
  }
 // Calculate the index of the first item to display based on the current page and items per page




  const handleCloseModal = () => {
    setShowModal(false);
    setClickedImage(null);
  }
  


  // redirect to projects page
 


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
              Create Contact
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="home" className="py-4">
            <section className="d-flex align-items-center my-2 mt-lg-3 mb-lg-5">
              <Container>
                <form onSubmit={(e)=>handleUpload(e)}>
                  <Row >
                  <Col xs={12} md={6}>
                      <Form.Group id="tasksubject" className="mb-4">
                        <Form.Label>Name</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Control  type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="tasksubject" className="mb-4">
                        <Form.Label>Contact No</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Control  type="number" placeholder="Contact No" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="tasksubject" className="mb-4">
                        <Form.Label>Email</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Control  type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="tasksubject" className="mb-4">
                        <Form.Label>Description</Form.Label>
                        <InputGroup>
                          <textarea rows={4} cols={60} placeholder="Task Subject" value={message} onChange={(e) => setMessage(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>


            <Col xs={12} md={6}>
                <Form.Group id="pname" className="mb-4">
                  <Form.Label>Type</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                    </InputGroup.Text>
                    <Form.Select  value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">Select Option</option>
                
                      {types.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>
              
              <Col xs={12} md={6}>
                      {name ? (<Form.Group id="Project Image" className="mb-4">
                        <Form.Label>Contact Card/Profile</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Control
                            type="file"
                            onChange={handleFileChange}
                            placeholder="Upload Image"
                          />
                        </InputGroup>
                      </Form.Group>) : (null)}

                    </Col>
              <Form.Label>Projects</Form.Label>
              <Multiselect tag="Projects" options={pnamearr} selectedValues={projects} setSelectedValues={setprojects}/>
                   
                    <Col className="d-flex justify-content-center"> {/* Centering the submit button */}
                    {istrue && (  <Button variant="primary" type="submit" className="w-100 mt-3">
                        Submit
                      </Button>)}  
                    
                    
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
