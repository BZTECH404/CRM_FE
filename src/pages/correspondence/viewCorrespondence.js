import React, { useState, useEffect } from "react";
import axios from "axios";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseurl, ProjectStatus, companies, Type, Acknowledgement, Forward } from "../../api";
import { triggerFunction, getPredefinedUrl } from '../../components/SignedUrl';
import { useHistory, useParams } from 'react-router-dom';
import { check } from '../../checkloggedin';
import Multiselect from "../../components/Multiselect";
import { useSelector, useDispatch } from 'react-redux';
import { fetchAsyncData } from '../../features/userslice'
import { deletetasks } from "../../features/taskslice";
import { addtaskhistory } from "../../features/taskhistoryslice";
import AddCorrHistory from "../components/AddCorrHistory";
import ViewCorrHistory from "../components/viewCorrHistory.js";
// import ViewTaskHistory from "../components/ViewTaskHistory";
import { fetchProjects } from "../../features/projectslice";
import { addcorrespondence, getcorrespondence, deletecorrespondence } from "../../features/correspondenceSlice";
import AddRefEncl from "../components/AddRefEncl.js";
import Swal from 'sweetalert2';
export default ({ initialRow = [] }) => {
  const param = useParams();
  const [pname, setPname] = useState('');
  const [people, setPeople] = useState('');
  const [pnamearr, setPnamearr] = useState([]);
  const [taskstatus, setTaskStatus] = useState('');
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [corr, setCorr] = useState([])
  const [date, setDate] = useState('')

  // for edit
  const [taskid, seteditTaskid] = useState("")
  const [editassignTaskTo, setEditassignTaskTo] = useState([])

  const [editCorrid, setEditCorrid] = useState("")
  const [editprojectname, setEditprojectname] = useState("")
  const [edittaskDescription, setEdittaskDescription] = useState("")
  const [edittaskSubject, setEdittaskSubject] = useState("")
  const [editFrom, setEditFrom] = useState("")
  const [editTo, setEditTo] = useState("")
  const [editdate, seteditdate] = useState(null)
  const [editType, setEditType] = useState("");
  const [editAcknowledgement, setEditAcknowledgement] = useState();
  const [editForwarded, setEditForwarded] = useState();
  const [editletterno, seteditletterno] = useState([])
  const [editMode, setEditMode] = useState(false);
  const [editFiles, setEditFiles] = useState([]);
  const [editFiles1, setEditFiles1] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showDynamicModal, setShowDynamicModal] = useState(false);
  const [currentRow, setCurrentRow] = useState(initialRow);
  const [editCompany, setEditCompany] = useState('');
  const [showModal3, setShowModal3] = useState(false);
  let [selectedFile, setSelectedFile] = useState(null);
  let [selectedFile1, setSelectedFile1] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFiltereData] = useState([]);
  const [showAdditionalFiles, setShowAdditionalFiles] = useState(false);

  // project filtering
  let [companyname, setCompanyName] = useState('')
  let [isActive, setIsActive] = useState(null)

  // view task History
  const [history, setHistory] = useState([])
  const [taskthis, settaskthis] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  //view add History
  const [texthistory, setaddtexthistory] = useState("")
  const [showModal2, setShowModal2] = useState(false);
  const [projectname, setprojectname] = useState("")

  //Created Option 
  let [createdoption, setCreatedoption] = useState(0)


  // Created Correspondence
  let [corrdetails, setcorrdetails] = useState({})
  let [files, setfiles] = useState([])
  let [id, setid] = useState("")
  const [fileExtension, setFileExtension] = useState('')
  const [stop, setStop] = useState(true)
  const [editselectedusers, setEditSelectedusers] = useState([])
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [rows, setRows] = useState(initialRow);
  const [url1, setUrl1] = useState('');
  const [key1, setKey1] = useState('');
  const [url2, setUrl2] = useState('');
  const [key2, setKey2] = useState('');
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [filterForwarded, setFilterForwarded] = useState("");
  const [filterAcknowledgement, setFilterAcknowledgement] = useState("");


  // common for all
  const dispatch = useDispatch();

  // for users
  const { user1, loading, error } = useSelector((state) => state.users);
  const { correspondence } = useSelector((state) => state.correspondence);

  const regex = new RegExp(searchTerm, 'i');

  const token = localStorage.getItem('token');

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

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.put(`${baseurl}/task/filter`, {
          projectid: pname || undefined,
          assignTaskTo: people ? [people] : undefined,
          taskCompleted: taskstatus || undefined
        });

        // Check if the response status is 200
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();

    dispatch(fetchAsyncData());

    if (user1.length !== 0) {
      setUsers(user1);
    }

    handleprojectFetch();
  }, [user1.length]);



  useEffect(() => {
    dispatch(getcorrespondence()).then((resp) => {
      setCorr(resp)
      // ////////console.log(resp)
    }).catch(error => {
      //////console.log(error)
    })


  }, [])

  const getLetterNoById = (id) => {
    // Find correspondence item by ID and return the letterNo
    const correspondence = corr.find((item) => item._id === id);
    // //////console.log(corr)

    if (correspondence) {
      return correspondence.letterno.toString() + "-" + correspondence.subject
    }

  };

  const getallcorrespondence = (corrid, from) => {

    dispatch(getcorrespondence()).then((resp) => {
      setCorr(resp)
      handleCorrhistory({ _id: corrid }, from)
      // ////////console.log(resp)
    }).catch(error => {
      //////console.log(error)
    })
  }

  const handleCorrhistory = async (row, from) => {
    //////////////////console.log("hi")

    // //////console.log(row._id)
    let singlecorr = corr.find((value) => value._id == row._id)
    // //////console.log(singlecorr)
    files = singlecorr.files
    if (from == false) {
      setfiles(singlecorr.files)
    }
    setid(row._id)
    setShowModal1(true)
    settaskthis(true)
  }


  const handleprojectFetch = async () => {
    //////////////////console.log(companyname)
    dispatch(fetchProjects({
      company: companyname ? companyname : null,
      status: isActive ? isActive : null
    })).then((resp) => {
      setPnamearr(resp)
      ////////console.log(resp)
    }).catch(error => {

    })
  }
  const handleFetch = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.put(`${baseurl}/task/filter`, {
        projectid: pname || undefined,
        assignTaskTo: people ? [people] : undefined,
        taskCompleted: taskstatus || undefined
      });
      setData(response.data);
      ////////console.log(response.data)

    } catch (error) {
      //console.error(error);
    }
  };

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


  const handleComplete = (id) => {
    // Find the task with the given id and toggle its completion status locally
    const updatedData = data.map(item => {
      if (item._id === id) {
        return { ...item, taskCompleted: !item.taskCompleted };
      }
      return item;
    });

    // Update the state with the modified data
    setData(updatedData);

    // Make the PUT request to update the task completion status on the server
    axios.put(`${baseurl}/task/complete/${id}`)
      .then(response => {
        // Handle success response if needed
      })
      .catch(error => {
        // If the request fails, revert the local state change
        //console.error(error);
        setData(data); // Revert back to the original data
      });
  };
  const handleEditModal = (item) => {
    // let temp = []
    // let tempuser = item.assignTaskTo
    // for (let j = 0; j < users.length; j++) {
    //   if ((tempuser).includes(users[j]._id)) {
    //     temp.push({
    //       id: users[j]._id,
    //       name: users[j].username,
    //     })
    //   }
    // }
    //////////////////console.log(temp,"hi")
    // seteditTaskid(item._id)
    // setEditassignTaskTo(temp)
    setEditCorrid(item._id)
    setEditprojectname(item.project)
    setEdittaskDescription(item.description)
    setEdittaskSubject(item.subject)
    setEditFrom(item.from)
    setEditTo(item.to)
    seteditletterno(item.letterno)
    seteditdate(item.date)
    setEditType(item.type)
    setEditAcknowledgement(item.acknowledgement)
    setEditForwarded(item.forwarded)
    setEditFiles(item.files)
    setEditFiles1(item.files1)
    setShowModal3(true);
    setEditMode(true); // Set editMode to true when opening the edit modal
  }

  const handleaddhistory = async (row, projectname) => {
    // //////console.log(row)
    // row.projectname = projectname
    setcorrdetails(row)
    // seteditTaskid(row._id)
    setShowModal2(true)
    // dispatch(addtaskhistory("hi"))

  }
  const timeinIndia = (date) => {
    const utcTime = new Date(date);
    // //////console.log(utcTime)
    const istTime = utcTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    return (istTime);
  }
  const sortbycreatedby = () => {
    // Increment the createdoption to toggle through sorting states
    let temp = createdoption + 1;
    if (temp > 2) {
      temp = 1; // Reset to 1 if it exceeds the number of sorting options
    }
    setCreatedoption(temp);

    // Make a copy of the data array to avoid mutating the state directly
    let sortedData = [...corr]; // Ensure corr is the state being rendered

    // Sort the data based on created date
    if (temp === 1) {
      // Ascending order: Oldest first
      sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (temp === 2) {
      // Descending order: Newest first
      sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    setCorr(sortedData); // Update the state with the sorted data
  };



  const handleRefClick = (row) => {
    setSelectedRow(row);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRow(null);
  };

  const handleDocumentClick = (document) => {
    const newcorr = corr.find((val) => val._id == document)
    //   const newRow = findprojectname(document); // Mock function to get the new row details based on the document ID or reference.
    //   if (newRow) {
    //     setShowDynamicModal((prevModals) => [...prevModals, document]);
    //   }
    //   cons
    setSelectedRow(newcorr); // Set the new row to be displayed in the modal
    setShowDynamicModal(true); // Re-open the modal with new details
  };

  const handleCloseDynamicModal = () => {
    setShowDynamicModal((prevModals) => prevModals.slice(0, - 1)); // Close the current dynamic modal
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setStop(false);
    if (file) {
      const fileExtension = file.name;
      setSelectedFile1(file);
      setFileExtension(fileExtension);

      try {
        const [url, key] = await triggerFunction(fileExtension, (folderName).trim());
        setUrl1(url); // For the first file
        setKey1(key); // For the first file
        setIsFileSelected(true);
      } catch (error) {
        console.error('Error triggering function:', error);
        toast.error('Failed to process the file');
      }
    } else {
      setSelectedFile1(null);
      setFileExtension('');
      setIsFileSelected(false);
    }
    setStop(true)
  };

  const handleFileChange1 = async (event) => {
    const file = event.target.files[0];
    setStop(false);
    if (file) {
      const fileExtension = file.name;
      setSelectedFile(file);
      setFileExtension(fileExtension);

      try {
        const [url, key] = await triggerFunction(fileExtension, (folderName).trim());
        setUrl2(url); // For the second file
        setKey2(key); // For the second file
        setIsFileSelected(true);
      } catch (error) {
        console.error('Error triggering function:', error);
        toast.error('Failed to process the file');
      }
    } else {
      setSelectedFile(null);
      setFileExtension('');
      setIsFileSelected(false);
    }
    setStop(true)
  };




  const handleEditSubmit = async (e) => {
    e.preventDefault();

    let file1UploadSuccess = true; // Assume success by default
    let file2UploadSuccess = true; // Assume success by default

    const fileUploadHandler = async (file, uploadUrl) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const fileContent = event.target.result;

          try {
            const responseFile = await fetch(uploadUrl, {
              method: 'PUT',
              body: fileContent,
              headers: {
                'Content-Type': 'application/octet-stream',
              },
              mode: 'cors',
            });

            if (!responseFile.ok) {
              throw new Error('Network response was not ok');
            }

            toast.success('File Uploaded Successfully');
            resolve(true); // Indicate success
          } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Failed to add image');
            resolve(false); // Indicate failure
          }
        };
        reader.readAsArrayBuffer(file);
      });
    };

    // Upload files and track success/failure
    if (selectedFile1) {
      file1UploadSuccess = await fileUploadHandler(selectedFile1, url1);
    }
    if (selectedFile) {
      file2UploadSuccess = await fileUploadHandler(selectedFile, url2);
    }

    // Only proceed if both file uploads succeeded
    if (!file1UploadSuccess || !file2UploadSuccess) {
      toast.error('File upload failed. Data update aborted.');
      return; // Stop further execution if any upload fails
    }

    const token = localStorage.getItem('token');

    // Create the files array by inserting new data if a new file was uploaded
    let files = [...editFiles]; // Copy the existing files

    if (selectedFile1) {
      // Determine the next available index for the new file
      const nextIndex = files.length;

      files.push({
        order: nextIndex,
        description: '',
        date: new Date().toISOString(),
        filename: selectedFile1.name,
        current: getPredefinedUrl(key1),
        prevlinks: files[nextIndex] && files[nextIndex].current ? [files[nextIndex].current] : [], // Only add to prevlinks if there's an existing current file
        isDisabled: false,
      });
    }

    // Same logic for files1 array
    let files1 = [...editFiles1];

    if (selectedFile) {
      const nextIndex1 = files1.length;

      files1.push({
        order: nextIndex1,
        description: '',
        date: new Date().toISOString(),
        filename: selectedFile.name,
        current: getPredefinedUrl(key2),
        prevlinks: files1[nextIndex1] && files1[nextIndex1].current ? [files1[nextIndex1].current] : [], // Only add to prevlinks if there's an existing current file
        isDisabled: false,
      });
    }

    const editData = {
      date: editdate,
      type: editType,
      from: editFrom,
      to: editTo,
      acknowledgement: editAcknowledgement,
      forwarded: editForwarded,
      description: edittaskDescription,
      letterno: editletterno,
      subject: edittaskSubject,
      files: files,
      files1: files1,
    };

    try {
      const response = await axios.put(
        `${baseurl}/correspondence/updatecorr/${editCorrid}`,
        editData,
        {
          headers: { Authorization: ` ${token}` },
        }
      );

      if (response.status === 200) {
        toast.success('Data updated successfully');
        toast.success('Remeber to add References');
        // setShowModal2(true)
        setShowModal(false);
        handleprojectFetch();
        setShowModal3(false);
        // setcorrdetails(e)
        // seteditTaskid(row._id)
        // setShowModal2(true)
        // handleaddhistory(editData, editprojectname); // Ensure you pass correct parameters (row and projectname)

        // Fetching correspondence and setting updated data
        dispatch(getcorrespondence())
          .then((resp) => {
            setCorr(resp);
          })
          .catch((error) => {
            //////console.log(error);
          });

        // Call handleaddhistory after successful updat
      }
    } catch (error) {
      console.error('Error updating record:', error);
      toast.error('Failed to update record');
    }
  };



  // Inside your component or wherever you are handling the delete
  const handleDelete = async (id) => {
    try {
      // Make API call to delete the correspondence
      const response = await axios.delete(`${baseurl}/correspondence/correspondences/delete/${id}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      // Check if the response is successful
      if (response.status === 200) {
        // Optional: Trigger a success toast notification
        toast.success("Correspondence deleted successfully!");

        // Dispatch the getcorrespondence function to refresh correspondence list
        dispatch(getcorrespondence())
          .then((resp) => {
            setCorr(resp); // Update state with new correspondence data
          })
          .catch((error) => {
            //////console.log("Error fetching updated correspondence:", error);
          });
      } else {
        // Handle failure response if status is not 200
        throw new Error("Failed to delete correspondence");
      }
    } catch (error) {
      console.error("Error deleting correspondence:", error);

      // Optional: Trigger an error toast notification
      toast.error("Failed to delete correspondence. Please try again.");
    }
  };

  useEffect(() => {
    // Update filteredData whenever corr or searchTerm changes
    const regex = new RegExp(searchTerm, 'i'); // Create a regex for case-insensitive search
    const filtered = corr.filter((item) => {
      const projectName = findprojectname(item.project); // Find the project name using project ID
      return (
        regex.test(item.letterno) ||
        regex.test(item.description) ||
        regex.test(item.subject) ||
        regex.test(item.date) ||
        (projectName && regex.test(projectName)) // Also search by project name
      );
    });
    setFiltereData(filtered);
  }, [searchTerm, corr]); // Run effect when searchTerm or corr changes

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term); // Update searchTerm state
  };

  const findprojectname = (projectId) => {
    const project = pnamearr.find((option) => option._id === projectId);
    return project ? project.name : null;
  };

  useEffect(() => {
    const handleFilter = () => {
      const filteredData = corr.filter(item => {
        return (
          (!filterFrom || item.from === filterFrom) && // Allow filterFrom to be optional
          (!filterTo || item.to === filterTo) &&        // Allow filterTo to be optional
          (!filterForwarded || item.forwarded === filterForwarded) && // Allow filterForwarded to be optional
          (!filterAcknowledgement || item.acknowledgement === filterAcknowledgement) // Allow filterAcknowledgement to be optional
        );
      });
      setFiltereData(filteredData); // Update the filtered data
    };

    handleFilter(); // Run the filter function inside useEffect
  }, [filterForwarded, filterAcknowledgement, filterFrom, filterTo, corr]); // Dependencies: runs whenever filterFrom, filterTo, or corr changes





  return (
    <>
      <ToastContainer />
      <form onSubmit={handleFetch}>
        <Row>
          <Col xs={12} md={4}>
            <Form.Group id="search" className="mb-4">
              <Form.Label>Search</Form.Label>
              <InputGroup>
                <InputGroup.Text></InputGroup.Text>
                <Form.Control
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search..."
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
            <Form.Label>From</Form.Label>
            <Form.Select
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)} // Update editFrom when dropdown changes
            >
              <option value="">Select Option</option>
              {contacts
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((contact, index) => (
                  <option key={index} value={contact.name}>
                    {contact.name}
                  </option>
                ))}
            </Form.Select>
          </Col>
          <Col xs={12} md={4}>
            <Form.Label>To</Form.Label>
            <Form.Select
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)} // Update editTo when dropdown changes
            >
              <option value="">Select Option</option>
              {contacts
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((contact, index) => (
                  <option key={index} value={contact.name}>
                    {contact.name}
                  </option>
                ))}
            </Form.Select>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={4}>
            <Form.Label>Forwarded</Form.Label>
            <Form.Select
              value={filterForwarded}
              onChange={(e) => setFilterForwarded(e.target.value)} // Update filterForwarded when dropdown changes
            >
              <option value="">Select Option</option>
              {Forward.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={12} md={4}>
            <Form.Label>Acknowledgement</Form.Label>
            <Form.Select
              value={filterAcknowledgement}
              onChange={(e) => setFilterAcknowledgement(e.target.value)} // Update filterForwarded when dropdown changes
            >
              <option value="">Select Option</option>
              {Acknowledgement.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </form>
      <section>
        <Container>
          <Row>
            <Col className="mx-auto">
              <Card style={{ width: "120%", marginLeft: "-10%", paddingLeft: "5%" }} border="light" className="shadow-sm">
                <Card.Header>
                  <Row className="align-items-center">
                    <Col>
                      <h5>Service List</h5>
                    </Col>
                  </Row>
                </Card.Header>
                <Table responsive className="align-items-center table-flush">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col" className="unselectable" style={{ cursor: "pointer" }} onClick={sortbycreatedby}>
                        Created At
                      </th>
                      <th scope="col">Project Name</th>
                      <th scope="col">Letter No</th>
                      <th scope="col">Forward Status</th>
                      <th scope="col">Acknowledgement Status</th>
                      {/* <th scope="col">Reference to</th>
                      <th scope="col">Reference from</th>
                      <th scope="col">Enclosed to</th>
                      <th scope="col">Enclosed from</th> */}
                      <th scope="col">File Current</th>
                      <th scope="col">File1 Current</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center">Loading...</td>
                      </tr>
                    ) : (
                      filteredData.map((row, index) => {
                        const projectName = findprojectname(row.project);
                        return projectName ? (
                          <tr key={index}>
                            <td style={{ whiteSpace: "pre-wrap" }}>{row.date}</td>
                            <td style={{ whiteSpace: "pre-wrap" }} onClick={() => handleRefClick(row)}>
                              {projectName}
                            </td>
                            <td style={{ whiteSpace: "pre-wrap" }}>{row.letterno}</td>
                            <td style={{ whiteSpace: "pre-wrap" }}>{row.forwarded}</td>
                            <td style={{ whiteSpace: "pre-wrap" }}>{row.acknowledgement}</td>
                            {/* Reference To */}
                            {/* <td style={{ whiteSpace: "pre-wrap" }}>
                              <ul style={{ listStyleType: 'none' }}>
                                {row.refto && row.refto.map((document, index) => (
                                  <li key={index} style={{ marginBottom: '5px', paddingLeft: '20px', textIndent: '-15px' }}>
                                    • <a style={{ textDecoration: "underline", cursor: "pointer" }} >
                                      {document}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </td> */}
                            {/* Reference From */}
                            {/* <td style={{ whiteSpace: "pre-wrap" }}>
                              <ul style={{ listStyleType: 'none' }}>
                                {row.reffrom && row.reffrom.map((document, index) => (
                                  <li key={index} style={{ marginBottom: '5px', paddingLeft: '20px', textIndent: '-15px' }}>
                                    • <a style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => handleRefClick(row)}>
                                      {document}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </td> */}
                            {/* Enclosed To */}
                            {/* <td style={{ whiteSpace: "pre-wrap" }}>
                              <ul style={{ listStyleType: 'none' }}>
                                {row.refto && row.refto.map((document, index) => (
                                  <li key={index} style={{ marginBottom: '5px', paddingLeft: '20px', textIndent: '-15px' }}>
                                    • <a style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => handleRefClick(row)}>
                                      {document}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </td> */}
                            {/* Enclosed From */}
                            {/* <td style={{ whiteSpace: "pre-wrap" }}>
                              <ul style={{ listStyleType: 'none' }}>
                                {row.reffrom && row.reffrom.map((document, index) => (
                                  <li key={index} style={{ marginBottom: '5px', paddingLeft: '20px', textIndent: '-15px' }}>
                                    • <a style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => handleRefClick(row)}>
                                      {document}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </td> */}
                            {/* File Current */}
                            <td colSpan="1">
                              {row.files && row.files.length > 0 ? (
                                <pre style={{ whiteSpace: "pre-wrap" }}>
                                  {row.files.slice(-1).map((file, index) => (
                                    <a
                                      key={index}
                                      href={file.current} // Ensure to download the file at the last index
                                      download
                                      style={{ textDecoration: "underline", color: "blue" }}
                                    >
                                      Link
                                    </a>
                                  ))}
                                </pre>
                              ) : (
                                <span>No appointment letters available</span>
                              )}
                            </td>
                            {/* File1 Current */}
                            <td colSpan="1">
                              {row.files1 && row.files1.length > 0 ? (
                                <pre style={{ whiteSpace: "pre-wrap" }}>
                                  {row.files1.slice(-1).map((file, index) => (
                                    <a
                                      key={index}
                                      href={file.current} // Ensure to download the file at the last index
                                      download
                                      style={{ textDecoration: "underline", color: "blue" }}
                                    >
                                      Acknowledgement Letter
                                    </a>
                                  ))}
                                </pre>
                              ) : (
                                <span>No acknowledgement letters available</span>
                              )}
                            </td>
                            <td>
                              <Button style={{ backgroundColor: "aqua", color: "black" }} variant="info" size="sm" onClick={() => handleEditModal(row)}>
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>
                              {/* <Button style={{ borderColor: "black", backgroundColor: "aqua", color: "black", marginLeft: "2%" }} onClick={() => handleDelete(row._id)} variant="danger" size="sm">
                                <FontAwesomeIcon icon={faTrash} />
                              </Button> */}
                              <Button style={{ backgroundColor: "aqua", color: "black", marginLeft: "2%" }} onClick={() => handleaddhistory(row, projectName)}>Add</Button>
                              <Button
                                style={{ backgroundColor: "aqua", color: "black", marginLeft: "2%" }}
                                onClick={() => handleComplete(row._id)}
                              >
                                {row.taskCompleted ? "Mark incomplete" : "Mark complete"}
                              </Button>
                            </td>
                          </tr>
                        ) : null;
                      })
                    )}
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>

          {/* Dynamic Modal */}
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Row Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedRow && (
                <Table>
                  <tbody>
                    <tr>
                      <td><strong>Created At:</strong></td>
                      <td>{timeinIndia(selectedRow.date)}</td>
                    </tr>
                    <tr>
                      <td><strong>Project Name:</strong></td>
                      <td>{findprojectname(selectedRow.project)}</td>
                    </tr>
                    <tr>
                      <td><strong>Subject:</strong></td>
                      <td>{selectedRow.subject}</td>
                    </tr>
                    <tr>
                      <td><strong>Type:</strong></td>
                      <td>{selectedRow.type}</td>
                    </tr>
                    <tr>
                      <td><strong>From:</strong></td>
                      <td>{selectedRow.from}</td>
                    </tr>
                    <tr>
                      <td><strong>To:</strong></td>
                      <td>{selectedRow.to}</td>
                    </tr>
                    <tr>
                      <td><strong>Letter No:</strong></td>
                      <td>{selectedRow.letterno}</td>
                    </tr>
                    <tr>
                      <td><strong>Acknowledgement</strong></td>
                      <td>{selectedRow.acknowledgement}</td>
                    </tr>
                    <tr>
                      <td><strong>Forward</strong></td>
                      <td>{selectedRow.forwarded}</td>
                    </tr>
                    <tr>
                      <td><strong>ID:</strong></td>
                      <td>{selectedRow._id}</td>
                    </tr>
                    <tr>
                      <td><strong>Description:</strong></td>
                      <td>{selectedRow.description}</td>
                    </tr>
                    {/* Map through all files and display */}
                    <tr>
                      <td><strong>Previous Link:</strong></td>
                      <td>
                        <ul style={{ listStyleType: 'none' }}>
                          {selectedRow.files && selectedRow.files.slice(0, -1).map((file, index) => (
                            <li key={index}>
                              {file.current ? (
                                <a href={file.current} download style={{ textDecoration: "underline", color: "blue" }}>
                                  {`File ${index + 1}`} - {file.date}
                                </a>
                              ) : "No file available"}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Previous Acknowledgement Letters:</strong></td>
                      <td>
                        <ul style={{ listStyleType: 'none' }}>
                          {selectedRow.files1 && selectedRow.files1.slice(0, -1).map((file, index) => (
                            <li key={index}>
                              {file.current ? (
                                <a href={file.current} download style={{ textDecoration: "underline", color: "blue" }}>
                                  {`File ${index + 1}`} - {file.date}
                                </a>
                              ) : "No file available"}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Link:</strong></td>
                      <td colSpan="1">
                        {selectedRow.files && selectedRow.files.length > 0 ? (
                          <pre style={{ whiteSpace: "pre-wrap" }}>
                            {selectedRow.files.slice(-1).map((file, index) => (
                              <a
                                key={index}
                                href={file.current} // Ensure to download the file at the last index
                                download
                                style={{ textDecoration: "underline", color: "blue" }}
                                
                              >
                                Appointment Letter
                              </a>
                            ))}
                          </pre>
                        ) : (
                          <span>No appointment letters available</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Acknowledgement Letters:</strong></td>
                      <td colSpan="1">
                        {selectedRow.files1 && selectedRow.files1.length > 0 ? (
                          <pre style={{ whiteSpace: "pre-wrap" }}>
                            {selectedRow.files1.slice(-1).map((file, index) => (
                              <a
                                key={index}
                                href={file.current} // Ensure to download the file at the last index
                                download
                                style={{ textDecoration: "underline", color: "blue" }}
                              >
                                Acknowledgement Letter
                              </a>
                            ))}
                          </pre>
                        ) : (
                          <span>No acknowledgement letters available</span>
                        )}
                      </td>
                    </tr>
                    {/* References */}
                    <tr>
                      <td><strong>References:</strong></td>
                      <td>
                        <ul style={{ listStyleType: 'none' }}>
                          {selectedRow.refto && selectedRow.refto.map((id, index) => (
                            <li
                              key={index}
                              onClick={() => handleDocumentClick(id)}
                              style={{ cursor: 'pointer', textDecoration: 'underline' }}
                            >
                              {getLetterNoById(id)} {/* Display the letterNo */}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Used At :</strong></td>
                      <td>
                        <ul style={{ listStyleType: 'none' }}>
                          {selectedRow.reffrom && selectedRow.reffrom.map((id, index) => (
                            <li
                              key={index}
                              onClick={() => handleDocumentClick(id)}
                              style={{ cursor: 'pointer', textDecoration: 'underline' }}
                            >
                              {getLetterNoById(id)} {/* Display the letterNo */}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                    {/* Enclosed */}
                    <tr>
                      <td><strong>Enclosed To:</strong></td>
                      <td>
                        <ul style={{ listStyleType: 'none' }}>
                          {selectedRow.enclosedto && selectedRow.enclosedto.map((id, index) => (
                            <li
                              key={index}
                              onClick={() => handleDocumentClick(id)}
                              style={{ cursor: 'pointer', textDecoration: 'underline' }}
                            >
                              {getLetterNoById(id)} {/* Display the letterNo */}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Enclosed From</strong></td>
                      <td>
                        <ul style={{ listStyleType: 'none' }}>
                          {selectedRow.enclosedfrom && selectedRow.enclosedfrom.map((id, index) => (
                            <li
                              key={index}
                              onClick={() => handleDocumentClick(id)}
                              style={{ cursor: 'pointer', textDecoration: 'underline' }}
                            >
                              {getLetterNoById(id)} {/* Display the letterNo */}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                    {/* Reply  */}
                    <tr>
                      <td><strong>Reply To:</strong></td>
                      <td>
                        <ul style={{ listStyleType: 'none' }}>
                          {selectedRow.replyto && selectedRow.replyto.map((id, index) => (
                            <li
                              key={index}
                              onClick={() => handleDocumentClick(id)}
                              style={{ cursor: 'pointer', textDecoration: 'underline' }}
                            >
                              {getLetterNoById(id)} {/* Display the letterNo */}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Reply From</strong></td>
                      <td>
                        <ul style={{ listStyleType: 'none' }}>
                          {selectedRow.replyfrom && selectedRow.replyfrom.map((id, index) => (
                            <li
                              key={index}
                              onClick={() => handleDocumentClick(id)}
                              style={{ cursor: 'pointer', textDecoration: 'underline' }}
                            >
                              {getLetterNoById(id)} {/* Display the letterNo */}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </section>
      {/* edit modal */}
      <Modal show={showModal3} onHide={() => setShowModal3(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* <Form.Group controlId="formProjectName">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                value={editprojectname}
                onChange={(e) => setEditprojectname(e.target.value)}
              />
            </Form.Group> */}
            <Form.Group controlId="formTaskSubject">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                value={edittaskSubject}
                onChange={(e) => setEdittaskSubject(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formTaskSubject">
              <Form.Label>Letter No</Form.Label>
              <Form.Control
                type="text"
                value={editletterno}
                onChange={(e) => seteditletterno(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formTaskDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={edittaskDescription}
                onChange={(e) => setEdittaskDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editDescription">
              <Form.Label>Type</Form.Label>
              <Form.Select required value={editType} onChange={(e) => setEditType(e.target.value)}>
                <option value="">Select Option</option>
                {Type.map((editType, index) => (
                  <option key={index} value={editType} >
                    {editType}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group id="pname" className="mb-4">
              <Form.Label>From</Form.Label>
              <InputGroup>
                <InputGroup.Text></InputGroup.Text>
                <Form.Select
                  value={editFrom}
                  onChange={(e) => {
                    setEditFrom(e.target.value);
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
            <Form.Group id="pname" className="mb-4">
              <Form.Label>To</Form.Label>
              <InputGroup>
                <InputGroup.Text></InputGroup.Text>
                <Form.Select
                  value={editTo}
                  onChange={(e) => {
                    setEditTo(e.target.value);
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
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="editAcknowledgement">
                  <Form.Label>Acknowledgement</Form.Label>
                  <Form.Check
                    type="checkbox"
                    label="Uploaded"
                    checked={editAcknowledgement === "Uploaded"}
                    onChange={(e) => {
                      setEditAcknowledgement(e.target.checked ? "Uploaded" : "");
                      setShowAdditionalFiles(e.target.checked); // Show or hide additional files field
                    }}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group controlId="editForwarded">
                  <Form.Label>Forward</Form.Label>
                  <Form.Check
                    type="checkbox"
                    label="Forwarded"
                    checked={editForwarded === "Uploaded"}
                    onChange={(e) =>
                      setEditForwarded(e.target.checked ? "Uploaded" : "")
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={editdate}
                onChange={(e) => seteditdate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formFiles">
              <Form.Label>Files</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleFileChange}
              />
              {/* <Form.Text className="text-muted">
                Current files: {editFiles.map(file => file.name).join(', ')}
              </Form.Text> */}
            </Form.Group>
            {showAdditionalFiles && (
              <Form.Group controlId="formFiles1">
                <Form.Label>Acknowledgement Files</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleFileChange1}
                />
                {/* <Form.Text className="text-muted">
                  Additional files: {editFiles1.map(file => file.name).join(', ')}
                </Form.Text> */}
              </Form.Group>
            )}

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal3(false)}>
            Close
          </Button>
          {stop ? (<><Col className="d-flex justify-content-end">
            <Button variant="primary" onClick={handleEditSubmit}>Submit</Button>
          </Col></>) : (<></>)}
        </Modal.Footer>
      </Modal>


      <ViewCorrHistory resett={getallcorrespondence} id={id} history={files} setHistory={setfiles} showModal1={showModal1} setShowModal1={setShowModal1} />
      {/* add history */}

      {/* <AddCorrHistory corr={corrdetails} showModal2={showModal2} setShowModal2={setShowModal2} /> */}

      <AddRefEncl corr={corrdetails} allcorr={corr} setcorr={setCorr} showModal2={showModal2} setShowModal2={setShowModal2} />



    </>
  );
}


