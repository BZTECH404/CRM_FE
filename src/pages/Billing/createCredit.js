import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';
import { baseurl, ProjectStatus, banknames, toi, companies } from "../../api";
import { triggerFunction, getPredefinedUrl } from '../../components/SignedUrl';
import { useHistory } from 'react-router-dom';
import { check } from '../../checkloggedin'
import Multiselect from "../../components/Multiselect";
import { useDispatch, useSelector } from "react-redux";
import {  useParams } from 'react-router-dom';
import { getcontacts } from "../../features/contactslice";
import { getinvoice } from "../../features/invoiceSlice"
import { fetchProjects } from "../../features/projectslice";


const CreateFunction = () => {

  // Checking Routes
  const fullUrl = window.location.href;
  // Get everything after the `#` (if present) or the pathname
  const hashIndex = fullUrl.indexOf("#");
  const relevantPath = hashIndex !== -1 ? fullUrl.slice(hashIndex + 1) : window.location.pathname;
  // Split the path by `/`
  const pathSegments = relevantPath.split("/");
  const final=`/${pathSegments.slice(-2).join("/")}`
  // for(let key in userpaths){
  //   if(userpaths[key].path==final){
  //     console.log(userpaths[key])
  //     if(userpaths[key].isActive){

  //     }
  //     else{
  //       return (<>Not allowed</>)
  //     }
  //   }
  // }
  const checkUserPath = async () => {
    try {
      // { path:final,userId:check()[0] }
      let body={
        final
      }
      const response = await axios.put(`${baseurl}/user/path/check`,body);
      // console.log(response.data); // Handle response
      // console.log("hi")
    } catch (error) {
      // console.log(error)
      // console.error(error.response?.data || error.message); // Handle error
    }
  };
  checkUserPath()


  const [imageUrl, setImageUrl] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [clickedImage, setClickedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);

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
  let [selectedFiles, setSelectedFiles] = useState([]);
  const [fileExtension, setFileExtension] = useState('');
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [folderName, setFolderName] = useState(''); // State for folder name
  const [folders, setFolders] = useState([]); // State for storing folder names
  const [url, setUrl] = useState('');
  const filepath = '../../index.js'

  let history = useHistory();


  // for this file only
  const [users, setUsers] = useState([])
  let [person, setPerson] = useState("")
  let [pname, setPname] = useState("")
  const [pnamearr, setPnamearr] = useState([])
  const [invoice, setInvoice] = useState("")
  const [selectedusers, setSelectedusers] = useState([])
  // for this create invoice only
  const [subject, setSubject] = useState(null)
  const [amount, setAmount] = useState(null)
  const [description, setDescription] = useState(null)
  const [createdate, setCreateDate] = useState('')

  const [credittype, setcredittype] = useState(null)
  const [bankaccount, setbankaccount] = useState(null)



  const dispatch = useDispatch()
  const { contacts, loading, error } = useSelector((state) => state.contact);
  const { invoices, loading1, error1 } = useSelector((state) => state.invoice)
  let [invoices1, setInvoices] = useState([])
  const token = localStorage.getItem('token');





  // project filtering
  let [isActive, setIsActive] = useState(null);
  let [companyname, setCompanyName] = useState('')
  let [isActives, setIsActives] = useState(null)



  const [paymentproof, setPaymentproof] = useState(false)

  
  const handleFileChange = async (event, tp) => {
    const files = event.target.files;
    const newSelectedFiles = [];
    ////////////console.log(tp)
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
    if (tp == "Payment") {
      selectedFiles[0] = newSelectedFiles[0]
    }
    if (tp == "invoice") {
      selectedFiles[1] = newSelectedFiles[0]
    }
    // else{
    // setSelectedFiles([...selectedFiles, ...newSelectedFiles]);
    // selectedFiles=[...selectedFiles, ...newSelectedFiles]
    // }
    // After the loop, update selectedFiles with the accumulated data


    // Check the result
    ////////////console.log(selectedFiles);
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

            }
          } catch (error) {
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
      let uniqueUrlsObjects = []
      if (uniqueUrls.length == 1) {
        uniqueUrlsObjects.push({ file: uniqueUrls[0], name: "Payment Proof" })
      }
      if (uniqueUrls.length == 2) {
        uniqueUrlsObjects.push({ file: uniqueUrls[0], name: "Payment Proof" })
        uniqueUrlsObjects.push({ file: uniqueUrls[1], name: "Tax Invoice" })

      }
      // const uniqueUrlsObjects = uniqueUrls.map(url => ({ file: url, name: "Payment Proof" }));


      const ids = selectedusers.map(user => user.id);
      const body = {
        amount: amount,
        person: person == '' ? undefined : person,
        createdAt: createdate,
        company: companyname,
        project: pname == '' ? undefined : pname,
        description: description,
        subject: subject,
        invoice: invoice == '' ? undefined : invoice,
        urls: uniqueUrlsObjects.length != 0 ? uniqueUrlsObjects : [],//new
        type: credittype,
        bank: bankaccount

      };
      // //////console.log(body)



      const responseFormData = await axios.post(`${baseurl}/income/create`, body);
      //////////////////////console.log(responseFormData);
      toast.success('Bill added successfully'); // Call toast.success after successful addition
      // setPerson("");
      // setCompanyName("");
      // setcredittype("");
      // setbankaccount("");
      // setCreateDate("");
      // setIsActive("");
      // setPname("");
      // setInvoice("");
      // setSubject("");
      // setAmount("");
      // setDescription("")
      setPaymentproof(false)
      setSelectedFiles([])
    } catch (error) {
      //console.error(error);
      // Assuming res is not defined, use //console.error instead
      //console.error({ message: "backend error", data: error });
    }
  };





  ////////////////////////////////////////////

  const handleprojectFetch = async () => {
    //////////////////////console.log(companyname)
    dispatch(fetchProjects({
      company: companyname ? companyname : null,
      status: isActive ? isActive : null
    })).then((resp) => {
      setPnamearr(resp)
      // //////////console.log(resp)
    }).catch(error => {

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
    dispatch(getcontacts())
    dispatch(getinvoice())
    setInvoices(invoices)
    //////////////////console.log(contacts)
    ////////////console.log(invoices)
  }, [contacts.length, invoices.length]);



  const handleInvoiceFilter = () => {
    let temp = (invoices.filter((item) =>
      (person == "" || item.person == person) &&
      (pname == "" || item.project == pname)
    ))
    ////////////console.log(person,invoices1)
    // for(let i=0;i<invoices1.length;i++){
    //   if(invoices1[i].person==pid){
    //     ////////////console.log(invoices1[i])
    //   }
    // }
    // ////////////console.log(invoices1,temp)
    setInvoices(temp)
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
              Create Credit
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
                        <Form.Label>Contact</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Select required value={person} onChange={(e) => {
                            person = e.target.value
                            setPerson(e.target.value)
                            handleInvoiceFilter()
                          }}>
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
                        <Form.Label>Type of Credit</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Select value={credittype} onChange={(e) => {
                            setcredittype(e.target.value)
                          }}>
                            <option value="">Select Option</option>
                            {toi.map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>Bank name</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Select value={bankaccount} onChange={(e) => setbankaccount(e.target.value)}>
                            <option value="">Select Option</option>
                            {/* Mapping through the arr array to generate options */}
                            {banknames.map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>
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

                    <Col xs={12} md={6}>
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>Project name</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Select value={pname} onChange={(e) => {
                            pname = e.target.value
                            setPname(e.target.value)
                            handleInvoiceFilter()
                          }}>
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
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>Under Invoice</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Select value={invoice} onChange={(e) => setInvoice(e.target.value)}>
                            <option value="">Select Option</option>
                            {/* Mapping through the arr array to generate options */}
                            {invoices1.map((option, index) => (
                              <option key={index} value={option._id}>{option._id}</option>
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
                          <Form.Control  type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
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
                    {person ? (
                      <Col xs={12} md={6}>
                        <Form.Group id="Project Image" className="mb-4">
                          <Form.Label>Payment Proof</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>
                            </InputGroup.Text>
                            <Form.Control
                              type="file"
                              onChange={(e) => {
                                handleFileChange(e, "Payment")
                                setPaymentproof(true)
                              }}
                              placeholder="Upload Image"
                            />
                          </InputGroup>
                        </Form.Group>

                        {/* 
                          {selectedFiles.map((file)=>{
                            return (
                              <p>{file.name}</p>
                            )
                          })} */}

                      </Col>


                    ) : (null)
                    }
                    <Col xs={12} md={6}>
                      {paymentproof ? (<Form.Group id="Project Image" className="mb-4">
                        <Form.Label>Invoice</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Control
                            type="file"
                            onChange={(e) => {
                              handleFileChange(e, "invoice")
                            }}
                            placeholder="Upload Image"
                          />
                        </InputGroup>
                      </Form.Group>) : (null)}

                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="Taskdescription" className="mb-4">
                        <Form.Label>Invoice Description</Form.Label>
                        <InputGroup>
                          <textarea  rows="4" cols="60" type="textarea" placeholder="Task Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>

                    </Col>
                    <Col className="d-flex justify-content-center"> {/* Centering the submit button */}
                      {invoice==""?(<></>):(
                      <>
                      <Button variant="primary" type="submit" className="w-100 mt-3">
                        Submit
                      </Button>
                      </>
                      )}
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


export default CreateFunction;