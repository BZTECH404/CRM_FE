import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';
import { baseurl ,ProjectStatus} from "../../api";
import { triggerFunction, getPredefinedUrl } from '../../components/SignedUrl';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { check } from '../../checkloggedin'
import { getcontacts } from "../../features/contactslice";
import Multiselect from "../../components/Multiselect";
import { fetchProjects } from "../../features/projectslice";


export default () => {

  const [imageUrl, setImageUrl] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [clickedImage, setClickedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);
 
  const itemsPerPage = 5; // Define itemsPerPage

  // State variables for edit modal


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


  // for this file only
  const [users, setUsers] = useState([])

  const [pname, setPname] = useState('')
  const [pnamearr, setPnamearr] = useState([])
 
  const [selectedusers, setSelectedusers] = useState([])
  // for this create invoice only
  const [subject,setSubject]=useState(null)
  const [amount,setAmount]=useState(null)
  const [description,setDescription]=useState(null)
  const [person,setPerson]=useState('')



  const token = localStorage.getItem('token');


  // project filtering
  let [isActive, setIsActive] = useState(null);
  let [companyname, setCompanyName] = useState('')
  let [isActives, setIsActives] = useState(null)


  // date
  const [createdate,setCreateDate]=useState('')
  const [credittype,setcredittype]=useState('')

  const dispatch = useDispatch()
  const { contacts, loading, error } = useSelector((state) => state.contact);


  useEffect(() => {
  
    dispatch(getcontacts())
   
    //////////////////console.log(contacts)
    //////////////////console.log(invoices)
  }, [contacts.length]);


  
  let [selectedFiles, setSelectedFiles] = useState([]);
  const handleFileChange = async (event) => {
    const files = event.target.files;
    const newSelectedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file) {
        // Read file extension
        const fileExtension = file.name;
        setSelectedFile(file);
        setFileExtension(fileExtension);
        const desiredContact = contacts.find(contact => contact._id == person);
        const arr1 = await triggerFunction(fileExtension, (desiredContact.name).trim());

        // Add arr1[0] and arr1[1] to the newSelectedFiles array
        newSelectedFiles.push([arr1[0], arr1[1], file]);
      }
    }

    // After the loop, update selectedFiles with the accumulated data
    
    setSelectedFiles([...selectedFiles, ...newSelectedFiles]);

    // Check the result
    ////////////////console.log(selectedFiles);
  };


  const handleUpload = async (e) => {
    e.preventDefault()
    const uniqueUrlsSet = new Set(); // Create a Set to store unique URLs


    let urls = []
    for (let i = 0; i < selectedFiles.length; i++) {
      // //////////////////////console.log("hi")
      let selectedFile = selectedFiles[i][2]
      const url = getPredefinedUrl(selectedFiles[i][1]);


      if (!uniqueUrlsSet.has(url)) {
        uniqueUrlsSet.add(url); // Add the URL to the Set
      }

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
              const responseFile = await fetch(selectedFiles[i][0], {
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

            toast.success(`${selectedFiles[i][1]} uploaded succesfully`); // Call toast.success after successful addition

            // Reload page after successful submission
            // window.location.reload();

            // Clear form data after submission

          }} catch (error) {
            //console.error('Error:', error);
            toast.error('Failed to add image'); // Display error toast if addition fails
          }
        };
        reader.readAsArrayBuffer(selectedFile);
      }
    }
    // api call

    try {
      const uniqueUrls = Array.from(uniqueUrlsSet);
      ////////////////console.log(uniqueUrls);
      const uniqueUrlsObjects = uniqueUrls.map(url => ({ file: url, name: "Proforma Invoice" }));


     
      const body = {
        createdAt:createdate,
        amount: amount,
        amount_paid:0,
        person:person==''?undefined:person,
        company:companyname,
        project:pname==''?undefined:pname,
        description: description,
        subject:subject,
        urls: uniqueUrlsObjects ? uniqueUrlsObjects : ["hello"],//new
        type:credittype,

      };

     
     
      const responseFormData = await axios.post(`${baseurl}/invoice/create`,body);
      //////////////////////console.log(responseFormData);
      // toast.success('Task added successfully'); // Call toast.success after successful addition
      // setPerson(null);
      // setCompanyName(null);
      // setcredittype(null);
      // setbankaccount(null);
      // setCreateDate(null);
      // setIsActive(null);
      // setPname(null);
      // setInvoice(null);
      // setSubject(null);
      // setAmount(null);
      // setSelectedFile(null)
    } catch (error) {
      //console.error(error);
      // Assuming res is not defined, use //console.error instead
      //console.error({ message: "backend error", data: error });
    }
  };





  const handleFileChange1 = (event) => {
    
    const file = event.target.files[0];
    if (file) {
      // Read file extension
      const fileExtension = file.name.split('.').pop();
      setSelectedFile(file);
      setFileExtension(fileExtension);
      let arr1 = triggerFunction(fileExtension, folderName)
      setUrl(arr1[0]); // Update URL with folderName
      setKey(arr1[1])
      setIsFileSelected(true); // Enable upload button
    } else {
      setSelectedFile(null);
      setFileExtension('');
      setIsFileSelected(false); // Disable upload button
    }
  };





  const handleUpload1 = (e) => {
    e.preventDefault()
    // //////////////////////console.log("hi")
    if (selectedFile != null) {
      //////////////////////console.log("hi",selectedFile)
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileContent = event.target.result;
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
            //////////////////////console.log('File uploaded successfully:', responseFile);
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
          subject:subject,
          amount: amount,
          description: description,
          project:pname,
          taskUrl: selectedFile ? getPredefinedUrl(key) : "hello"
        };

        //////////////////console.log(body)
        // Example: Posting additional form data using Axios
        // const responseFormData = await axios.post(`${baseurl}/project/create`,body, {
        //   headers: {
        //     Authorization: `${token}`,
        //     'Content-Type': 'multipart/form-data', // Set appropriate content type
        //   },
        // });
        const responseFormData = await axios.post(`${baseurl}/invoice/create`, body);
        //////////////////////console.log(responseFormData);
        toast.success('Task added successfully'); // Call toast.success after successful addition
        // window.location.reload()
        setSelectedFile(null)
      } catch (error) {
        //console.error(error);
        // Assuming res is not defined, use //console.error instead
        //console.error({ message: "backend error", data: error });
      }
    })();

  };


  ////////////////////////////////////////////

  const handleprojectFetch = async () => {
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
    getcontacts()
  }, []);




  const handleCloseModal = () => {
    setShowModal(false);
    setClickedImage(null);
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
              Create Invoice
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="home" className="py-4">
            <section className="d-flex align-items-center my-2 mt-lg-3 mb-lg-5">
              <Container>
                <form onSubmit={handleUpload}>
                  <Row >
                  <Col xs={12} md={6}>
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>Creation Date</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Control  required type="date" placeholder="Amount" value={createdate} onChange={(e) => setCreateDate(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  <Col xs={12} md={6}>
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>Contact</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Select required value={person} onChange={(e) => setPerson(e.target.value)}>
                            <option value="">Select Option</option>
                            {/* Mapping through the arr array to generate options */}
                            {contacts.map((option, index) => (
                              <option key={index} value={option._id}>{option.name}</option>
                            ))}
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>Type of Credit</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Select value={credittype} onChange={(e) => {
                            setcredittype(e.target.value)
                          }}>
                            <option value="">Select Option</option>
                            <option value="Fees">Fees</option>
                            <option value="Services">Services</option>
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>Company Name</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Select  value={companyname} onChange={(e) => {
                            companyname = e.target.value
                            setCompanyName(e.target.value)
                            handleprojectFetch()
                          }}>
                            <option value="">Select Option</option>
                            <option value="Neo">Neo Modern</option>
                            <option value="BZ">BZ Consultants</option>
                            <option value="PMC">PMC</option>
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="taskstatus" className="mb-4">
                        <Form.Label>Project Status</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Select  value={isActive} onChange={(e) => {
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

                    <Col xs={12} md={6}>
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>Project name</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Select required value={pname} onChange={(e) => setPname(e.target.value)}>
                            <option value="">Select Option</option>
                            {/* Mapping through the arr array to generate options */}
                            {pnamearr.map((option, index) => (
                              <option key={index} value={option._id}>{option.name}</option>
                            ))}
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="tasksubject" className="mb-4">
                        <Form.Label>Subject</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Control  required type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="tasksubject" className="mb-4">
                        <Form.Label>Amount</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Control  required type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>



                    <Col xs={12} md={6}>
                      {person?( <Form.Group id="Project Image" className="mb-4">
                        <Form.Label>Invoice Image if Required</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Control
                            type="file"
                            onChange={handleFileChange}
                            placeholder="Upload Image"
                          />
                        </InputGroup>
                      </Form.Group>):(null)}
                     
                    </Col>
                    {/* <Col xs={12} md={6}>
                      <Form.Group id="ptype" className="mb-4">
                        <Form.Label>Assign Task To</Form.Label>
                          {users?(<Multiselect 
                          selectedValues={selectedusers} 
                          setSelectedValues={setSelectedusers} 
                          options={users}/>):(
                            <p>loading</p>
                            )}
                      </Form.Group>
                    </Col> */}

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
                    <Col xs={12} md={6}>
                      <Form.Group id="Taskdescription" className="mb-4">
                        <Form.Label>Invoice Description</Form.Label>
                        <InputGroup>
                          <textarea  required rows="4" cols="60" type="textarea" placeholder="Task Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>

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
          {/* Second Pane */}
        
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
