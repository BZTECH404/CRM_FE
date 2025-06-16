import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';
import { baseurl, ProjectStatus, banknames, types, Agency, companies } from "../../api";
import { triggerFunction, getPredefinedUrl } from '../../components/SignedUrl';
import { useHistory } from 'react-router-dom';
import { check,geturl } from '../../checkloggedin'
import Multiselect from "../../components/Multiselect";
import { useDispatch, useSelector } from "react-redux";
import { getcontacts } from "../../features/contactslice";
import { getinvoice } from "../../features/invoiceSlice"
import { fetchProjects } from "../../features/projectslice";
import { getConsolidated, disableConsolidated } from "../../features/consolidatedSlice";


export default () => {

  const [imageUrl, setImageUrl] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [clickedImage, setClickedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const itemsPerPage = 5; // Define itemsPerPage

  // State variables for edit modal

  const [editIsActive, setEditIsActive] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  const [arr, setArr] = useState([]);

  ////mine
  const [key, setKey] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  let [selectedFiles, setSelectedFiles] = useState([]);
  const [fileExtension, setFileExtension] = useState('');
  const filepath = '../../index.js'

  let history = useHistory();


  // for this file only
  const [users, setUsers] = useState([])
  let [person, setPerson] = useState("")
  let [pname, setPname] = useState("")
  const [pnamearr, setPnamearr] = useState([])
  const [invoice, setInvoice] = useState(null)
  const [selectedusers, setSelectedusers] = useState([])
  // for this create invoice only
  const [subject, setSubject] = useState(null)
  const [amount, setAmount] = useState(0)
  let [paymenttype, setPaymenttype] = useState("")

  const [credittype, setcredittype] = useState(null)
  const [bankaccount, setbankaccount] = useState(null)
  let [editUrls, setEditUrls] = useState([])



  const dispatch = useDispatch()
  const { contacts, loading, error } = useSelector((state) => state.contact);
  const { invoices, loading1, error1 } = useSelector((state) => state.invoice)
  let [invoices1, setInvoices] = useState([])
  const token = localStorage.getItem('token');





  // project filtering
  let [isActive, setIsActive] = useState(null);
  let [companyname, setCompanyName] = useState('')
  let [isActives, setIsActives] = useState(null)
  let [amounttbrecieved, setAmounttbRecieved] = useState(0)
  let [amountrecieved, setAmountRecieved] = useState(0)
  let [consoid, setconsoid] = useState("")

  const fileInputRef = useRef(null);
  const [paymentproof, setPaymentproof] = useState(false)

  // for Consolidated
  let [conso, setConso] = useState([])

  let [description, setDescription] = useState('')
  let [editProject, setEditProject] = useState('')
  let [editstage, setEditStage] = useState('')
  // let [editproject,setEditProject]=useState('')
  let [edittotalfees, setEdittotalfees] = useState(0)
  let [editamounttst, setEditamounttst] = useState(0)
  let [editamountrec, setEditamountrec] = useState(0)
  let [edittype, setEdittype] = useState('')
  let [editDescription, setEditDescription] = useState('')
  let [previous, setPrevious] = useState([])

  let [stop,setstop]=useState(true)


  const handleFileChange = async (event, tp) => {
    const files = event.target.files;
    const newSelectedFiles = [];
    ////////////console.log(tp)
    setstop(false)
    for (let i = 0; i < files.length; i++) {

      const file = files[i];

      if (file) {
        // Read file extension
        const fileExtension = file.name;
        setSelectedFile(file);
        setFileExtension(fileExtension);
        const projectobj = pnamearr.find(proj => proj._id == pname);
        const arr1 = await triggerFunction(fileExtension, (projectobj.name).trim())

        // Add arr1[0] and arr1[1] to the newSelectedFiles array
        newSelectedFiles.push([arr1[0], arr1[1], file]);
        setstop(true)

      }
    }
    if (tp == "Calculation") {
      selectedFiles[0] = newSelectedFiles[0]
    }
   

    //////console.log(selectedFiles)
  };
  // const handleEditFileChange = async (event, tp) => {
  //   const files = event.target.files;
  //   const newSelectedFiles = [];
  //   ////////////console.log(tp)
  //   for (let i = 0; i < files.length; i++) {

  //     const file = files[i];

  //     if (file) {
  //       // Read file extension
  //       const fileExtension = file.name;
  //       setSelectedFile(file);
  //       setFileExtension(fileExtension);
  //       const projectobj = pnamearr.find(proj => proj._id == editProject);
  //       triggerFunction(fileExtension, projectobj.name).then((res)=>{
  //         //////console.log(res)
  //       })

  //       // Add arr1[0] and arr1[1] to the newSelectedFiles array
  //       // newSelectedFiles.push([arr1[0], arr1[1], file]);
  //     }
  //   }
  //   // if (tp == "Calculation") {
  //   //   selectedFiles[0] = newSelectedFiles[0]
  //   //   //////console.log(selectedFiles)
  //   // }

  //   // else{
  //   // setSelectedFiles([...selectedFiles, ...newSelectedFiles]);
  //   // selectedFiles=[...selectedFiles, ...newSelectedFiles]
  //   // }
  //   // After the loop, update selectedFiles with the accumulated data


  //   // Check the result
  //   ////////////console.log(selectedFiles);
  // };
  const handleEditFileChange = async (event, tp) => {
    const files = event.target.files;
    const newSelectedFiles = [];
    setstop(false)

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file) {
        const fileExtension = file.name;
        setSelectedFile(file);
        setFileExtension(fileExtension);

        const projectobj = pnamearr.find(proj => proj._id == editProject);

        try {
          const res = await triggerFunction(fileExtension, (projectobj.name).trim())
          // //////console.log(res); // Log the response from triggerFunction
          newSelectedFiles.push([res[0], res[1], file]);
          if (tp == "Calculation") {
            selectedFiles[0] = newSelectedFiles[0]
            // //////console.log(selectedFiles)
          }
          setstop(true)
        } catch (error) {
          console.error('Error in triggerFunction:', error);
        }
      }
    }

  };

  const handleUpload = async (e) => {
    e.preventDefault()
    const uniqueUrlsSet = new Set(); // Create a Set to store unique URLs

    let urls = []
    for (let i = 0; i < selectedFiles.length; i++) {
      // //////////////////////console.log("hi")
      let selectedFile = selectedFiles[i][2]
      //////console.log(selectedFiles[i][1])
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
      ////////console.log(uniqueUrls);
      let uniqueUrlsObjects = []
      if (uniqueUrls.length == 1) {
        uniqueUrlsObjects.push({ file: uniqueUrls[0], name: "Calculations" })
      }
      //   if(uniqueUrls.length==2){
      //     uniqueUrlsObjects.push({file:uniqueUrls[0],name:"Payment Proof"})
      //     uniqueUrlsObjects.push({file:uniqueUrls[1],name:"Tax Invoice"})

      //   }
      //   const uniqueUrlsObjects = uniqueUrls.map(url => ({ file: url, name: "Payment Proof" }));



      const body = {
        project: pname == '' ? undefined : pname,
        total_amount: amount,
        amount_stage: amounttbrecieved,
        amount_recieved: amountrecieved,
        type: paymenttype,
        description: description,
        urls: uniqueUrlsObjects.length != 0 ? uniqueUrlsObjects : [],//new
      };
      ////////console.log(body)



      const responseFormData = await axios.post(`${baseurl}/consolidated/create`, body);
      ////////console.log(responseFormData);
      toast.success('Consolidated Statement Added successfully'); // Call toast.success after successful addition
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
      fileInputRef.current.value = null;
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
      }, []);


    handleprojectFetch()
    // dispatch(getcontacts())
    // dispatch(getinvoice())
    dispatch(getConsolidated()).then((res) => {
      //////console.log(res)
      setConso(res)
    }).catch(err => {
      //////console.log(err)
    })
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




  const findprojectname = (project) => {
    //////////////////console.log(project,"Find project name")
    // //////////////////////console.log(pnamearr)
    let str = ""
    for (let i = 0; i < pnamearr.length; i++) {
      // //////////////////console.log(pnamearr[i])
      if (pnamearr[i]._id == project) {
        str = str + "{" + pnamearr[i].name + "}"
        break
      }

    }
    // for(let i=0;i<projects.length;i++){
    //////////////////////console.log(projects[i])
    //     for(let j=0;j<pnamearr.length;j++){
    //   if(pnamearr[j]._id==projects[i]){
    //     str=str+"{"+pnamearr[j].name+"}"
    //     break
    //   }
    //     }
    //   }
    return str
  }
  // https://officecrm560.s3.ap-south-1.amazonaws.com/Imtiaz+Bandra++41./Lucky+Realty+Bandra1717420102462.xlsx
  // https://officecrm560.s3.ap-south-1.amazonaws.com/Imtiaz+Bandra++41./Lucky+Realty+Bandra1717419135299.xlsx
  const handleEditModal = (item) => {
    //////console.log(item)

    //////////////////console.log(temp,"hi")

    setEditProject(item.project)
    setEdittotalfees(item.total_amount)
    setEditamounttst(item.amount_stage)
    setEditamountrec(item.amount_recieved)
    setEditUrls(item.urls)
    setEdittype(item.type)
    setconsoid(item._id)
    setPrevious(item.previous)
    setEditDescription(item.description)
    setShowModal(true);
    setEditMode(true); // Set editMode to true when opening the edit modal
  }

  const handleaddhistory = () => {

  }

  const handleComplete = () => {

  }
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    const uniqueUrlsSet = new Set(); // Create a Set to store unique URLs

    let urls = []
    for (let i = 0; i < selectedFiles.length; i++) {
      // //////////////////////console.log("hi")
      let selectedFile = selectedFiles[i][2]

      const url = getPredefinedUrl(selectedFiles[i][1]);
      // //////console.log(selectedFiles[i][1])

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
      ////////console.log(uniqueUrls);
      let uniqueUrlsObjects = []
      if (uniqueUrls.length == 1) {
        uniqueUrlsObjects.push({ file: uniqueUrls[0], name: "Calculations" })
      }
      //   if(uniqueUrls.length==2){
      //     uniqueUrlsObjects.push({file:uniqueUrls[0],name:"Payment Proof"})
      //     uniqueUrlsObjects.push({file:uniqueUrls[1],name:"Tax Invoice"})

      //   }
      //   const uniqueUrlsObjects = uniqueUrls.map(url => ({ file: url, name: "Payment Proof" }));


      const ids = selectedusers.map(user => user.id);
      const body = {
        project: editProject,
        total_amount: edittotalfees,
        amount_stage: editamounttst,
        amount_recieved: editamountrec,
        type: edittype,
        description: editDescription,
        urls: uniqueUrlsObjects.length != 0 ? uniqueUrlsObjects : editUrls,//new
      };
      //////console.log(body)



      const responseFormData = await axios.put(`${baseurl}/consolidated/${consoid}`, body);
      ////////console.log(responseFormData);
      toast.success('Consolidated Statement Added successfully'); // Call toast.success after successful addition
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
      // fileInputRef.current.value = null;

      dispatch(getConsolidated()).then((res) => {
        setConso(res)
      })
      setShowModal(false)
      setPaymentproof(false)
      setSelectedFiles([])
    } catch (error) {
      //console.error(error);
      // Assuming res is not defined, use //console.error instead
      //console.error({ message: "backend error", data: error });
    }
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
      <Tab.Container defaultActiveKey="profile">
        <Nav fill variant="pills" className="flex-column flex-sm-row">
          <Nav.Item>
            <Nav.Link eventKey="profile" className="mb-sm-3 mb-md-0">
              Table
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="home" className="mb-sm-3 mb-md-0">
              Create Project
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

                    <Col xs={12} md={6}>
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>Project name</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Select required
                            value={pname} onChange={(e) => {
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
                      <Form.Group id="taskstatus" className="mb-4">
                        <Form.Label>Types of Payment</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Select value={paymenttype} onChange={(e) => { setPaymenttype(e.target.value) }
                          }>
                            <option value="">Select Option</option>
                            {/* Mapping through the arr array to generate options */}
                            {types.map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="tasksubject" className="mb-4">
                        <Form.Label>Total Amount</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Control  required type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="tasksubject" className="mb-4">
                        <Form.Label>Amount to be Recieved</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Control  required type="number" placeholder="Amount" value={amounttbrecieved} onChange={(e) => setAmounttbRecieved(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="tasksubject" className="mb-4">
                        <Form.Label>Amount Recieved</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Control  required type="number" placeholder="Amount" value={amountrecieved} onChange={(e) => setAmountRecieved(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      {pname ? (

                        <Form.Group id="Project Image" className="mb-4">
                          <Form.Label>Calculation</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>
                            </InputGroup.Text>
                            <Form.Control
                              type="file"
                              ref={fileInputRef}
                              onChange={(e) => {
                                handleFileChange(e, "Calculation")
                                setPaymentproof(true)
                              }}
                              placeholder="Upload Image"
                            />
                          </InputGroup>
                        </Form.Group>

                      ) : (null)}
                      {/* 
                          {selectedFiles.map((file)=>{
                            return (
                              <p>{file.name}</p>
                            )
                          })} */}

                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group className="mb-3" controlId="editHeading">
                        <Form.Label>Description</Form.Label>
                      </Form.Group>
                      <textarea rows="4" cols="50" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </Col>
                    <Col className="d-flex justify-content-center"> {/* Centering the submit button */}
                    {stop &&<Button variant="primary" type="submit" className="w-100 mt-3">
                        Submit
                      </Button>}
                    </Col>
                  </Row>
                </form>
              </Container>
            </section>
          </Tab.Pane>
          <Tab.Pane eventKey="profile" className="py-4">
            <Card style={{ width: "max-content" }} border="light" className="shadow-sm">
              {/* Second Pane */}
              <Table responsive style={{ width: "maxWidth" }} className="align-items-center table-flush">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Project Name</th>
                    <th scope="col">Stage</th>
                    <th scope="col">Type</th>
                    <th scope="col">Description</th>
                    <th scope="col">Total Fees</th>
                    <th scope="col">Amount till stage</th>
                    <th scope="col">Amount Recieved</th>
                    <th scope="col">Link</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {conso.map((row, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{findprojectname(row.project)}</td>
                      <td>{row.stage}</td>
                      <td>{row.type}</td>
                      <td><pre>{row.description}</pre></td>
                      <td>{row.total_amount}</td>
                      <td>{row.amount_stage}</td>
                      <td>{row.amount_recieved}</td>
                      {row && (
                        <td colSpan="1">
                          <pre style={{ whiteSpace: "pre-wrap" }}>
                            {row.urls && row.urls[0] && (
                              <>
                                <a href={geturl(row.urls[0].file)} download style={{ textDecoration: "underline", color: "blue" }}>
                                  -{row.urls[0].name}
                                </a>
                                <br />
                              </>
                            )}
                          </pre>
                        </td>
                      )}
                      <td>
                        <Button style={{ backgroundColor: "aqua", color: "black" }} variant="info" size="sm" onClick={() => handleEditModal(row)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button style={{ borderColor: "black", backgroundColor: "aqua", color: "black", marginLeft: "2%" }} onClick={() => dispatch(disableConsolidated(row._id))} variant="danger" size="sm">
                          <FontAwesomeIcon icon={faTrash} />
                        </Button></td>
                    </tr>
                  ))}
                </tbody>

              </Table>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Edit Consolidated Bills</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="editHeading">
            <Form.Label>Project</Form.Label>
            <Form.Select value={editProject} onChange={(e) => setEditProject(e.target.value)}>
              <option value="">Select Option</option>
              {/* Mapping through the arr array to generate options */}
              {pnamearr.map((option, index) => (
                <option key={index} value={option._id}>{option.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="editHeading">
            <Form.Label>Stage</Form.Label>
            <p>hello</p>
          </Form.Group>
          <Form.Group id="pname" className="mb-4">
            <Form.Label>Total Fees</Form.Label>
            <InputGroup>
              <InputGroup.Text></InputGroup.Text>
              <Form.Control  required type="number" placeholder="Amount" value={edittotalfees} onChange={(e) => setEdittotalfees(e.target.value)} />
            </InputGroup>
          </Form.Group>
          <Form.Group id="pname" className="mb-4">
            <Form.Label>Amount till Stage</Form.Label>
            <InputGroup>
              <InputGroup.Text></InputGroup.Text>
              <Form.Control  required type="number" placeholder="Amount" value={editamounttst} onChange={(e) => setEditamounttst(e.target.value)} />
            </InputGroup>
          </Form.Group>
          <Form.Group id="pname" className="mb-4">
            <Form.Label>Amount Recieved</Form.Label>
            <InputGroup>
              <InputGroup.Text></InputGroup.Text>
              <Form.Control  required type="number" placeholder="Amount" value={editamountrec} onChange={(e) => setEditamountrec(e.target.value)} />
            </InputGroup>
          </Form.Group>
          <Form.Group id="pname" className="mb-4">
            <Form.Label>Type</Form.Label>
            <InputGroup>
              <InputGroup.Text></InputGroup.Text>
              <Form.Select value={edittype} onChange={(e) => { setEdittype(e.target.value) }
              }>
                <option value="">Select Option</option>
                {/* Mapping through the arr array to generate options */}
                {types.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </Form.Select>
            </InputGroup>
          </Form.Group>


          <Form.Group className="mb-3" controlId="editHeading">
            <Form.Label>Description</Form.Label>
          </Form.Group>
          <textarea rows="4" cols="50" type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />

          <Form.Group className="mb-3" controlId="editHeading">
            <Form.Label>Payment Proof</Form.Label>
            <p>Current File:<a style={{ textDecoration: "underline" }}>{editUrls[0]?.file}</a></p>
            <InputGroup>
              <Form.Control
                type="file"
                onChange={(e) => {
                  handleEditFileChange(e, "Calculation")
                }}
                placeholder="Upload Image"
              />
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="editHeading">
            <Form.Label>Project</Form.Label>
            <Form.Select value={editProject} onChange={(e) => setEditProject(e.target.value)}>
              <option value="">Select Option</option>
              {/* Mapping through the arr array to generate options */}
              {pnamearr.map((option, index) => (
                <option key={index} value={option._id}>{option.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          {stop && <Button variant="primary" onClick={(e) => handleEditSubmit(e)}>
            Save Changes
          </Button>}
        </Modal.Footer>
      </Modal>
    </>
  );
};
