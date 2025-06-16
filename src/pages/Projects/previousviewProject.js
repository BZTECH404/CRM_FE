import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { useParams } from 'react-router-dom';
import { getquestions } from '../../features/questionslice.js'
import { current } from "@reduxjs/toolkit";
import Swal from 'sweetalert2';
import { Rings } from 'react-loader-spinner';
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import FAQS from "./FAQS.js";
export default () => {

  // common for all
  const dispatch = useDispatch();

  const [projectName, setProjectName] = useState('');


  const [filename, setfilename] = useState('')
  const [createdate, setCreateDate] = useState('')
  const [loading, setLoading] = useState(false);

  const [developer, setDeveloper] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [area, setArea] = useState(0)
  const [company, setCompany] = useState('')
  const [pstage, setpstage] = useState('')
  let [filearr, setfilearr] = useState('')
  const [storyDate, setStoryDate] = useState('');
  const [storyText, setStoryText] = useState('');

  const [imageUrl, setImageUrl] = useState(null);
  const [isActive, setIsActive] = useState('false');
  let [companyname, setCompanyName] = useState("")
  let [feactive, setfeactive] = useState("")
  const [users, setUsers] = useState([])
  const [selectedusers, setSelectedusers] = useState([])

  const [currentPage, setCurrentPage] = useState(0);
  const [clickedImage, setClickedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModal5, setShowModal5] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [selectedBill, setSelectedBill] = useState(null);


  const itemsPerPage = 5; //Define itemsPerPage

  // State variables for edit modal
  const [editFiles, setEditFiles] = useState([]);
  const [editProjectId, setEditProjectId] = useState('');
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectType, setEditProjectType] = useState('');
  const [editProjectStage, setEditProjectStage] = useState('');
  const [editProjectStatus, setEditProjectStatus] = useState('')
  const [editDeveloper, setEditDeveloper] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editProjectDescription, setEditProjectDescription] = useState('');
  const [editArea, setEditArea] = useState(null);
  const [editimageUrl, setEditImageUrl] = useState(null);
  const [editselectedusers, setEditSelectedusers] = useState([])
  const [addimage, setAddImage] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFileId, setEditFileId] = useState('');
  const [editFileName, setEditFileName] = useState('');
  const [editFileDate, setEditFileDate] = useState('');
  const [editFileOrder, setEditFileOrder] = useState('0');
  const [editFileLink, setEditFileLink] = useState('');
  const [editFileStoryText, setEditFileStoryText] = useState('');
  const [editFileStoryOrder, setEditFileStoryOrder] = useState('');
  const [editFileStoryDate, setEditFileStoryDate] = useState('');
  const [editStoryId, setEditStoryId] = useState('');
  const [vieweditfiledate, setvieweditfiledate] = useState(null)


  let [files, setfiles] = useState([])


  const [ptype, setPtype] = useState('');
  const [arr, setArr] = useState([]);
  const [pstatus, setPstatus] = useState('')

  ////mine
  let [key, setKey] = useState("");
  let [url, setUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  let [selectedFiles, setSelectedFiles] = useState([])
  const [fileExtension, setFileExtension] = useState('');
  const [isFileSelected, setIsFileSelected] = useState(false);

  const [folderName, setFolderName] = useState(''); // State for folder name
  const [folders, setFolders] = useState([]); // State for storing folder names



  // For table
  let [regu, setregu] = useState(null)
  let { id } = useParams();



  //For FAQS
  let [question, setquestions] = useState([])
  let [editmode, seteditmode] = useState(false)
  let [selectedquestion, setselectedquestion] = useState([])
  let [selectedquestions, setselectedquestions] = useState([])
  let [existingquestion, setexistingquestion] = useState([])
  let [thisproject, setthisproject] = useState(null)
  let [editorder, seteditorder] = useState(false)
  ///for disabled

  let [isDisabled, setIsDisabled] = useState(false)
  let [isD, setIsD] = useState(false)
  let [isD1, setIsD1] = useState(false)
  const [bills, setBills] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [contact, setContact] = useState([]);
  const { id: projectId } = useParams();
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showModal4, setShowModal4] = useState(false);
  const Today = new Date().toISOString().split("T")[0];
  const [createsdate, setCreatesDate] = useState(Today)
  const [formData, setFormData] = useState([{
    date: Today,
    orderNumber: '0',
    description: ''
  }]);
  const [selectedFile1, setSelectedFile1] = useState(null);
  const [url1, setUrl1] = useState('');
  const [key1, setKey1] = useState('');
  const [fileUrl, setFileUrl] = useState(selectedFile?.url || '');
  let [stories, setStories] = useState([]);
  let [createdoption, setCreatedoption] = useState(0)
  const [type, setType] = useState("")
  const [pname, setPname] = useState(""); // Example for pname state
  const [nameofproject, setnameofproject] = useState("")
  const [enable, setenable] = useState(false)

  // Files Section
  const [search, setSearch] = useState("")
  const [midfiles, setmidfiles] = useState([])

  let history = useHistory();


  const types = ["Developer", "Financer", "MEP", "Structural", "Architect", "Land Owner", "Agent", "Miscellaneous Consultant", "Society Member"]

  ////////////////////////////////////////////



  //For Type
  useEffect(() => {

    //////console.log(id)

    // Set the value of arr using some asynchronous operation or any other logic
    // dispatch(getquestions()).then((res) => {
    //   // let temp=[]
    //   // temp=res.map((val)=>val.question)
    //   //console.log(res)
    //   let arr = res
    //   // arr.sort((a, b) => a.order - b.order);
    //   setquestions(res)
    //   // //////console.log(res)
    // })

    // Hello
    axios.get(`${baseurl}/question`)
      .then(response => {
        let arr = response.data
        arr.sort((a, b) => a.order - b.order);
        // //console.log(question)
        question = arr
        setquestions(arr)
      })
      .catch(error => {
        //console.error(error);
      })
    const fetchOptions = async () => {
      try {
        // Example asynchronous operation fetching data
        // const response = await fetch('your/api/endpoint');
        // const data = await response.json();
        // // Assuming the data received is an array of options
        const arr = ["Reg 30B", "33(1)", ...Array.from({ length: 31 }, (_, i) => `33(${i + 1})`)];
        setArr(arr);


      } catch (error) {
        //console.error('Error fetching options:', error);
      }
    };

    // Call the fetchOptions function to set the value of arr
    fetchOptions();
  }, [question.length]);

  /// for bill
  useEffect(() => {
    if (projectId) {
      axios.get(`${baseurl}/income/${projectId}`)
        .then(response => {
          // //////console.log('API response:', response.data); // Log the response to see its structure
          const data = response.data;

          // Check the structure of `data`
          // //////console.log('Data:', data);

          // Set bills based on the API response structure
          if (Array.isArray(data)) {
            setBills(data);
          } else if (data.data && Array.isArray(data.data)) {
            setBills(data.data);
          } else {
            setBills([]);
          }
        })
        .catch(error => console.error('Error fetching bills:', error));
    }
  }, [projectId, baseurl]);


  /// for task
  useEffect(() => {
    if (projectId) {
      axios.get(`${baseurl}/task/${projectId}`)
        .then(response => {
          // //////console.log('API response:', response.data); // Log the response to see its structure
          const data = response.data;

          // Check the structure of `data`
          // //////console.log('Data:', data);

          // Set bills based on the API response structure
          if (Array.isArray(data)) {
            setTasks(data);
          } else if (data.data && Array.isArray(data.data)) {
            setTasks(data.data);
          } else {
            setTasks([]);
          }
        })
        .catch(error => console.error('Error fetching task:', error));
    }
  }, [projectId, baseurl]);

  // for contact
  const handleFetch = async () => {
    const body = {
      project: pname,
      type: type,
    };

    try {
      const response = await axios.put(`${baseurl}/contact/all`, body);
      setData(response.data); // Store the fetched data in the state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    handleFetch(); // Call the fetch function inside useEffect
  }, [pname, type]); // Optionally, trigger on changes to pname and type

  const filteredData = data.filter(item => item.projects.includes(projectId));

  const handleprojectFetch = async (e) => {
    ////////////////////////console.log(companyname)
    //////console.log(typeof (isDisabled))

    dispatch(fetchProjects({
      company: companyname ? companyname : null,
      status: feactive ? feactive : null,
      isDisabled: isDisabled == 'true' ? true : false,
      type: regu ? regu : null,
    })).then((resp) => {
      setData(resp)
      //////console.log(resp)
    }).catch(error => {

    })
  }


  useEffect(() => {
    // Fetch Projects
    dispatch(fetchProjects({
      company: companyname ? companyname : null,
      status: feactive ? feactive : null,
      isDisabled: isDisabled === 'true' ? true : false,
      id: id
    })).then((resp) => {
      setthisproject(resp[0]);
      let currentProject = resp[0];

      // Handle Files
      let tempFiles = currentProject.files;
      let finalFiles = tempFiles.filter((val) => !val.isDisabled);
      // console.log(tempFiles)
      setfiles(finalFiles);
      setmidfiles(finalFiles)

      // Handle Stories (similar to files)
      let tempStories = currentProject.stories;
      let finalStories = tempStories.filter((story) => !story.isDisabled);
      setStories(finalStories);

      // Handle FAQS
      //console.log(currentProject.questions)
      setexistingquestion(currentProject.questions)

    }).catch(error => {
      console.error("Error fetching projects:", error);
    });

    // Fetch Users
    axios.get(`${baseurl}/user/`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [companyname, feactive, isDisabled, id]); // Add relevant dependencies for re-renders





  const handleimport = (e) => {
    e.preventDefault()
    dispatch(importquestions(id)).then((res) => {
      //   dispatch(fetchProjects({
      //     id
      //   })).then((resp) => {
      //     setthisproject(resp[0])
      //     thisproject = resp[0]
      //     //////console.log(thisproject)
      //     setexistingquestion(resp[0].questions)
      //   }).catch((err)=>{
      //     //console.log(err,"err1")
      //   })
    }).catch((err) => {
      //console.log(err, "err2")
    })
  }

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

  const handleEditModalStory = (item) => {
    setEditMode(true); // Set edit mode to true for editing functionality

    // Set state variables to populate the modal with current file details
    setEditStoryId(item._id); // ID of the file being edited
    setEditFileStoryText(item.storyText);
    setEditFileStoryOrder(item.order); // File order
    setEditFileStoryDate(item.date); // File date

    // Show the modal
    setShowModal4(true);
  };




  const handleEditSubmit = async (e) => {
    // s3
    e.preventDefault()
    // //////console.log("here")
    // //////console.log(selectedquestions)
    //////console.log(existingquestion)
    // let newquestions = []
    // for (let i = 0; i < existingquestion.length; i++) {
    //   newquestions.push(existingquestion[i])
    // }


    // for (let i = 0; i < selectedquestions.length; i++) {
    //   let flag = true
    //   for (let j = 0; j < existingquestion.length; j++) {
    //     if (existingquestion[i].question == selectedquestions[i]) {
    //       flag = false
    //       break
    //     }
    //   }
    //   //////console.log(flag)
    //   if (flag == true) {
    //     newquestions.push({ question: selectedquestions[i], answer: "" })
    //     //////console.log("pushing")
    //   }
    // }
    // //////console.log(newquestions)

    const token = localStorage.getItem('token');

    const editData = {
      questions: existingquestion
    };
    //////////////////////console.log(clickedImage)


    try {
      //////////////////////console.log(editselectedusers)
      const response = await axios.put(`${baseurl}/project/addquestions/${id}`, editData, {
        headers: {
          Authorization: `${token}`
        }
      });
      // //////////////////////console.log('Updated data:', response.data);
      toast.success('Data updated successfully');

      // Refresh
      dispatch(importquestions(id)).then((res) => {
        dispatch(fetchProjects({
          id
        })).then((resp) => {
          setthisproject(resp[0])
          thisproject = resp[0]
          //console.log(resp[0].questions)
          setexistingquestion(resp[0].questions)
        })
      })

      setShowModal(false);
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


  let startIndex = currentPage * itemsPerPage;
  let endIndex = (currentPage + 1) * itemsPerPage;
  // let currentItems = data.slice(startIndex, endIndex);
  const findprojectname = (project) => {
    //////////////////console.log(project,"Find project name")
    // //////////////////////console.log(pnamearr)
    let str = ""
    for (let i = 0; i < data.length; i++) {
      // //////////////////console.log(pnamearr[i])
      if (data[i]._id == project) {
        str = data[i].name
        break
      }

    }
    return str
  }

  const handleeditmode = async (e) => {
    try {
      const isValid = await checkloginvailidity();
      //////console.log(isValid)
      if (isValid) {
        seteditmode(!editmode);
      } else {
        toast.error("Not Verified Account");
      }
    } catch (error) {
      console.error("Error checking validity:", error);
      toast.error("An error occurred while checking validity");
    }
  };

  const findinexistingquestion = () => {

  }
  const findQuestion = (id) => {
    if (!id || question.length === 0) {
      return "";
    }

    const foundQuestion = question.find((item) => item._id === id);
    return foundQuestion ? foundQuestion.question : "";
  };
  const findQuestionType = (id) => {
    if (!id || question.length === 0) {
      return "";
    }

    const foundQuestion = question.find((item) => item._id === id);
    // //console.log(foundQuestion)
    return foundQuestion ? foundQuestion.type : "";
  };
  const findfile = (id) => {
    let temp = files.find((option) => option._id == id)
    return temp
  }

  const handlesubmit = (e) => {
    e.preventDefault()
    //////console.log("hello")

  }
  const handleAnswerChange = (index, newValue) => {
    // Create a copy of existingquestion array
    //console.log(index, newValue)
    const updatedQuestions = [...existingquestion];
    // Update the answer property for the specified index
    updatedQuestions[index] = { ...updatedQuestions[index], answer: newValue };
    // Update the state with the new array
    setexistingquestion(updatedQuestions);
  };
  const handleInputChange = (e, questionId) => {
    const updatedAnswers = existingquestion.map(answer =>
      answer.question === questionId
        ? { ...answer, answer: e.target.value }
        : answer
    );
    setexistingquestion(updatedAnswers);
  };

  let [stop, setstop] = useState(true)
  ////////////////////////////// For Addition and Viewing Files
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
        setSelectedFile(file);
        setFileExtension(fileExtension);

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
  };


  let [editSelected, seteditSelectedFiles] = useState([])

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



  const fileadd = async (bool) => {
    //////console.log('Boolean parameter:', bool);

    // Check if files are available in `thisproject`
    if (!thisproject || !thisproject.files) {
      console.error('No files found in thisproject.');
      return;
    }

    let files = thisproject.files;
    //////console.log('Original files:', files);

    if (bool === "") {
      // Set the files to the original list if bool is empty
      setfiles(files);
      setmidfiles(files)
    } else {
      // Filter stories based on the `bool` parameter
      let temp = [];

      for (let i = 0; i < files.length; i++) {
        if ((files[i].isDisabled).toString() === bool.toString()) {
          temp.push(files[i]);
        }
      }

      //////console.log('Filtered files:', temp);
      // Update the state or do something with the filtered files
      setfiles(temp);
      setmidfiles(temp)
    }

  };

  const handleeditorder = (id, value) => {
    //////console.log(id, value)
    let updatedFiles = [...files];
    for (let i = 0; i < updatedFiles.length; i++) {
      if (updatedFiles[i]._id === id) {
        //////console.log("found")
        updatedFiles[i] = { ...updatedFiles[i], order: Number(value) };
        break; // Exit the loop once the file is found and updated
      }
    }
    files = updatedFiles
    setfiles(updatedFiles)
    //////console.log(files)
  }

  // Function to filter and display stories based on `isDisabled` status
  const storyadd = (bool) => {
    //////console.log('Boolean parameter:', bool);

    // Check if stories are available in `thisproject`
    if (!thisproject || !thisproject.stories) {
      console.error('No stories found in thisproject.');
      return;
    }

    let Stories = thisproject.stories;
    //////console.log('Original Stories:', Stories);

    if (bool === "") {
      // Set the stories to the original list if bool is empty
      setStories(Stories);
    } else {
      // Filter stories based on the `bool` parameter
      let temp = [];

      for (let i = 0; i < Stories.length; i++) {
        if ((Stories[i].isDisabled).toString() === bool.toString()) {
          temp.push(Stories[i]);
        }
      }

      //////console.log('Filtered Stories:', temp);
      // Update the state or do something with the filtered stories
      setStories(temp);
    }
  };






  const handleeditorder1 = (id, value) => {
    //////console.log(id, value);
    // Create a copy of the stories array
    let updatedStory = [...stories];

    // Loop through the array to find the story with the matching id
    for (let i = 0; i < updatedStory.length; i++) {
      if (updatedStory[i]._id === id) {
        //////console.log("found");
        // Update the order value
        updatedStory[i] = { ...updatedStory[i], order: Number(value) };
        break; // Exit the loop once the file is found and updated
      }
    }

    // Use setStories to update the state directly, which will trigger a re-render
    setStories(updatedStory);
    //////console.log(updatedStory);
  };



  const updateorder = () => {
    //////console.log(id)
  }

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

      dispatch(fetchProjects({
        company: companyname ? companyname : null,
        status: feactive ? feactive : null,
        isDisabled: isDisabled === 'true',
        id: id
      })).then((resp) => {
        setthisproject(resp[0]);
        thisproject = resp[0];
        //////console.log(thisproject);
        let temp = thisproject.files;
        let finalfiles = temp.filter((val) => !val.isDisabled);
        files = finalfiles;
        setfiles(finalfiles);
        setmidfiles(finalfiles)
      }).catch(error => {
        console.error('Error fetching projects:', error);
      });

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





  const handleView = (bill) => {
    setSelectedBill(bill);
    setShowModal1(true);
  };

  const handleClose = () => setShowModal1(false);

  const handleViewTask = (tasks) => {
    setSelectedTask(tasks);
    setShowModal2(true);
  };
  const handleViewClick = (bill) => {
    setSelectedBill(bill);
    setShowModal5(true);
  };

  const handleCloseModal = () => {
    setShowModal2(false);
    setSelectedTask(null);
    setShowModal5(false);
  };

  const handleShowModalStory = () => setShowModal3(true);
  const handleCloseModalStory = () => setShowModal3(false);

  const handleSubmitStory = async (e, typeofstory) => {
    e.preventDefault();

    const storyData = {
      storyText: formData.description,
      date: createsdate,
      order: parseInt(formData.orderNumber, 10),
      type: typeofstory
    };

    try {
      // Use the id from useParams directly for creating a story
      await dispatch(createStory(id, storyData));
      setFormData({
        date: '',
        orderNumber: '',
        description: '',
      });
      handleCloseModalStory()
      dispatch(fetchProjects({
        company: companyname ? companyname : null,
        status: feactive ? feactive : null,
        isDisabled: isDisabled == 'true' ? true : false,
        type: regu ? regu : null,
        id: id
      })).then((resp) => {
        // //////console.log(resp[0].stories)
        setStories(resp[0].stories)
        //////console.log(resp)
      }).catch(error => {

      })
    } catch (error) {
      console.error('Error creating story:', error);
    }
  };


  const handleDelete = (pid, fid,) => {
    dispatch(deletefiles(pid, fid));
  };

  const handleDeleteStory = (pid, sid) => {
    dispatch(deleteStory(pid, sid));
    dispatch(fetchProjects({
      id: id,
      company: companyname ? companyname : null,
      status: feactive ? feactive : null,
      isDisabled: isDisabled == 'true' ? true : false,
      type: regu ? regu : null,
    })).then((resp) => {
      // //////console.log(resp[0].stories)
      setStories(resp[0].stories)
      //////console.log(resp)
    }).catch(error => {

    })
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    dispatch(fetchProjects({
      company: companyname ? companyname : null,
      status: feactive ? feactive : null,
      isDisabled: isDisabled == 'true' ? true : false,
      type: regu ? regu : null,
      id: id
    })).then((resp) => {
      // //////console.log(resp[0].stories)
      setStories(resp[0].stories)
      //////console.log(resp)
    }).catch(error => {

    })
  };

  const handleSaveStory = async () => {
    try {
      // Ensure storyId is correctly used and passed
      const response = await axios.put(
        `${baseurl}/project/updatestories/${id}/${editStoryId}`, // Use editStoryId here
        {
          storyText: editFileStoryText,
          order: editFileStoryOrder,
          date: editFileStoryDate
        }
      );
      // Show success toast
      toast.success('Story updated successfully!');
      dispatch(fetchProjects({
        company: companyname ? companyname : null,
        status: feactive ? feactive : null,
        isDisabled: isDisabled == 'true' ? true : false,
        type: regu ? regu : null,
        id: id
      })).then((resp) => {
        // //////console.log(resp[0].stories)
        let newStories = resp[0].stories
        setStories(newStories)
        //////console.log(resp)
      }).catch(error => {

      })

    } catch (error) {
      // Show error toast
      toast.error('Error updating story. Please try again.');
      console.error('Error updating story:', error);
    }
    setShowModal4(false);
    // window.location.reload();
  };


  const sortByDateStory = () => {
    // Increment the createdoption to toggle through sorting states
    let temp = createdoption + 1;
    if (temp > 2) {
      temp = 1; // Reset to 1 if it exceeds the number of sorting options
    }
    setCreatedoption(temp);

    // Make sure formData is an array before sorting
    // if (!Array.isArray(formData)) {
    //   console.error('formData is not an array:', formData);
    //   return;
    // }

    // Make a copy of the data array to avoid mutating the state directly
    let sortedData = [...stories];

    // Sort the data based on created date
    if (temp === 1) {
      // Ascending order: Oldest first
      sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (temp === 2) {
      // Descending order: Newest first
      sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    setStories(sortedData); // Update the state with the sorted data
  };
  // Files Section
  const sortByDateFile = () => {
    // Increment the createdoption to toggle through sorting states
    let temp = createdoption + 1;
    if (temp > 2) {
      temp = 1; // Reset to 1 if it exceeds the number of sorting options
    }
    setCreatedoption(temp);

    // Make sure formData is an array before sorting
    // if (!Array.isArray(formData)) {
    //   console.error('formData is not an array:', formData);
    //   return;
    // }

    // Make a copy of the data array to avoid mutating the state directly
    let sortedData = [...files];

    // Sort the data based on created date
    if (temp === 1) {
      // Ascending order: Oldest first
      sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (temp === 2) {
      // Descending order: Newest first
      sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    setfiles(sortedData); // Update the state with the sorted data
    setmidfiles(sortedData); // Update the state with the sorted data

  };

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

  // Files Section Ends here
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
  const generateDocx = () => {
    let watermarkUrl = './b.jpg'; // Reference the image in the current directory
    let htmlContent = ``
    let start = `  <html>
    <head>
        <style>
            .watermark {
                border:1px solid red;
                 top: 5%;
                transform: translate(-12%%, -30%); /* Proper centering */
                opacity:1;
                z-index: -1;
                pointer-events: none;
            }
           #example1 {
                border: 2px solid black;
                padding: 25px;
                position:relative
                
              }
                
            #example1 .background-image {
              width:95%;
              position: absolute;
    
            }
              
        </style>
    </head>
    <body>
    
    <div id="example1">
            <div class="background-image"></div>
             <img  class="background-image" src="./c.png" width="60%" />
             <br><br><br><br><br><br><br><br><br><br>
            <h1>Project:${nameofproject}</h1>
            `
    let end = `
                 </div>
    </body>
    </html>
    `;



    let count = 0
    question.forEach((option, index) => {
      const questionText = option.question || "Unknown Question";
      let currentAnswer = existingquestion.find(data => data.question === option._id);
      let tempfile;
      let flag = false;

      // if(count%10==0||count==0){
      //   console.log("here")
      //   htmlContent +=`<img class="watermark" src="./a.jpg" width="130%" />
      //     `
      // }
      // console.log(count)
      console.log(questionText, currentAnswer)
      if ((/XL/i.test(questionText) && /Feasibility/i.test(questionText)) || /pitched/i.test(questionText) || (currentAnswer?.answer == "")) {
        flag = true; // Skip this iteration if both words are found in the question text

      }
      else {
        count++
        // console.log(count,questionText,flag,currentAnswer.answer)
        // Handle "Text" type answer
        if (option.type === "Text") {
          htmlContent += `
            <p style="border:1px solid black;padding:2px"><strong>${count}. ${questionText}</strong></p>
            <pre style="white-space: pre-wrap;">${flag == true ? ("NA") : (currentAnswer?.answer || "NA")}</pre>
            <br>
          `;
        }
        // Handle "Link" type answer
        else if (option.type === "Link") {
          tempfile = currentAnswer ? findfile(currentAnswer.answer) : null; // Find corresponding file if available
          htmlContent += `
            <p style="border:1px solid black;padding:2px"><strong>${count}. ${questionText}</strong></p>
            <a style="color: blue; text-decoration: underline;" href="${flag == true ? (null) : (geturl(tempfile?.current) || '#')}" download>
              ${flag == true ? ("NA") : (tempfile?.filename || "NA")}
            </a>
            <br>
          `;
        }
      }

    });

    var opt = {
      margin: 0.5,
      // filename: 'myfile.pdf',
      // image:        { type: 'jpeg', quality: 0.98 },
      // html2canvas:  { scale: 2 },
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 3,  // High quality rendering
        // letterRendering: true, // Ensure letters are rendered properly

      },
      jsPDF: { unit: 'in', format: 'a3', orientation: 'portrait' },
      // jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    // Create a PDF from the HTML content with the watermark

    let final = start + htmlContent + end
    // html2pdf()
    //   .from(final).set(opt)
    //   .save('document.pdf'); // Saves the file as PDF


    html2pdf().from(final).set(opt).toPdf().get('pdf').then((pdf) => {
      const pdfWidth = pdf.internal.pageSize.width;
      const pdfHeight = pdf.internal.pageSize.height;

      // Add watermark image
      const img = new Image();
      img.src = './a.png'; // Replace with your watermark image URL


      img.onload = () => {
        // Canvas
        // Create a canvas to adjust opacity
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size to the image size
        canvas.width = img.width;
        canvas.height = img.height;

        // Set opacity (0.0 to 1.0)
        ctx.globalAlpha = 0.2; // Set opacity to 20%

        // Draw the image onto the canvas with opacity
        ctx.drawImage(img, 0, 0);

        // Convert canvas to data URL (base64 image)
        const dataUrl = canvas.toDataURL('image/png');
        const scale = 0.5; // Scale the watermark image
        const x = (pdfWidth - img.width * scale) / 2; // Center horizontally
        const y = (pdfHeight - img.height * scale) / 2; // Center vertically

        // Add watermark image to every page
        const totalPages = pdf.internal.pages.length;
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i); // Set the current page
          pdf.addImage(dataUrl, 'PNG', 2.5, 5, 0, 0, '', 'SLOW');
        }

        // Save the PDF with watermark on all pages
        pdf.save(`${nameofproject}` + ` Report`);
      };
    });
  };
  //   const doc = new jsPDF();
  //   doc.html(final, {
  //     callback: function (doc) {
  //         doc.save('output.pdf');
  //     },
  //     x: 10,
  //     y: 10,
  // });

  const [pdfFile, setPdfFile] = useState(null);

  const handleFilesChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPdfFile(file);
    }
  };




  return (
    <>
      <ToastContainer />
      <Card border="light" className="shadow-sm">

      </Card>
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-2">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Projects</Breadcrumb.Item>
            <Breadcrumb.Item active>Create Projects</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <h1>Project:{thisproject ? (<h1>{thisproject.name}</h1>) : (<p>Loading</p>)}</h1>
      <Tab.Container defaultActiveKey="home">
        <Nav fill variant="pills" className="flex-column flex-sm-row">
          <Nav.Item>
            <Nav.Link eventKey="home" className="mb-sm-3 mb-md-0">FAQS</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="clstory" className="mb-sm-3 mb-md-0">Client Story</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="story" className="mb-sm-3 mb-md-0">Story</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="profile" className="mb-sm-3 mb-md-0">Files</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="Add" className="mb-sm-3 mb-md-0">Add Files</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="bills" className="mb-sm-3 mb-md-0">Bills</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="task" className="mb-sm-3 mb-md-0">Task</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="contact" className="mb-sm-3 mb-md-0">Conatct</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          {/* FAQ Section */}
          <Tab.Pane eventKey="home" className="py-4">

            {/* no <Button  variant="secondary" size="sm" onClick={handleeditmode}>Edit</Button> */}
            {/* <div>
      <h1>Upload PDF and Apply Watermark</h1>
      <input type="file" accept="application/pdf" onChange={handleFilesChange} />
      {pdfFile && (
        <div>
          <p>Selected PDF: {pdfFile.name}</p>
          <button onClick={applyWatermark}>Apply Watermark</button>
        </div>
      )}
    </div> */}
            {/* <div style={{border:"1px solid red",display:"flex"}}>
  <img style={{width:"100%"}} src="./c.png"></img>
  <div style={{fontSize:"80px",alignContent:"flex-end"}}>
  <h1 style={{fontSize:"80px",alignContent:"flex-end"}}>BZ CONSULTANTS</h1>
  </div>
</div>
<hr style={{border:"3px solid black"}}/> */}

            
 {/* faqs */}
          <section>
            {/*  no <Button style={{minHeight:"10000px"}} variant="secondary" size="sm" onClick={handleeditmode}>Edit</Button> */}

            <Container >

                <Row>
                    <Col style={{ border: "0px solid red", maxWidth: "5%" }} className="mx-auto">
                        <Button style={{ minHeight: "100%" }} variant="secondary" size="sm" onClick={handleeditmode}>
                            <p>Edit</p>
                        </Button>
                    </Col>
                    <Col style={{ border: "0px solid red", maxWidth: "5%" }} className="mx-auto">
                        <Button style={{ minHeight: "100%" }} variant="secondary" size="sm" onClick={(e) => handleimport(e)}>
                            <p>Import</p>
                        </Button>
                    </Col>
                    <Col className="mx-auto">
                        <Card style={{ border: "5px solid red" }} border="light" className="shadow-sm text-start">

                            <Card.Header>

                                <Col className="text-start">
                                    <Button variant="secondary" size="sm" onClick={handleeditmode}>Edit</Button>
                                    {/* {editmode && ( */}
                                    <Button variant="secondary" size="sm" onClick={(e) => handleimport(e)}>Import</Button>
                                    {/* )} */}
                                    <Button variant="secondary" size="sm" onClick={(e) => setenable(!enable)}>Create Public</Button>
                                    <Button variant="secondary" size="sm" onClick={(e) => generateDocx(e)}>Generate Without Project Name</Button>

                                    {/* )} */}
                                    {enable && (<>
                                        <Form.Control
                                            type="text"
                                            name="date"
                                            value={nameofproject}
                                            onChange={(e) => {
                                                setnameofproject(e.target.value)
                                                // console.log("hi")
                                            }}
                                            required
                                        />
                                        <Button variant="secondary" size="sm" onClick={(e) => generateDocx(e)}>Submit</Button>

                                    </>
                                    )

                                    }
                                </Col>
                            </Card.Header>
                            {
                                existingquestion && question && question.map((option, index) => {
                                    let currentAnswer = existingquestion.find(data => data.question === option._id);
                                    let tempfile;
                                    // //console.log(option.type)
                                    if (option.type == "Link") {
                                        tempfile = currentAnswer ? findfile(currentAnswer.answer) : null;
                                        // //console.log(tempfile)
                                    }

                                    return (

                                        <>

                                            <div style={{ backgroundColor: currentAnswer?.answer == "" ? "black" : "none" }}>
                                                <React.Fragment key={option._id}>
                                                    <p style={{ border: "1px solid black" }}>{index + 1}.{option.question}</p>
                                                    {editmode ? (
                                                        option.type === "Text" ? (
                                                            <>
                                                                <textarea
                                                                    value={currentAnswer?.answer || ''}
                                                                    onChange={(e) => handleInputChange(e, option._id)}
                                                                    style={{ width: "100%", minHeight: "60px" }}
                                                                />
                                                                <Form.Select
                                                                    required
                                                                    value=""
                                                                    onChange={(e) => handleInputChange(e, option._id)}
                                                                >
                                                                    <option value={""}>Nothing</option>
                                                                    {currentAnswer.prevanswer.map((prevOption, idx) => (
                                                                        <option key={idx} value={prevOption}>{prevOption}</option>
                                                                    ))}
                                                                </Form.Select>
                                                            </>

                                                        ) : (
                                                            <>
                                                                <a
                                                                    onClick={() => {
                                                                        let pawan = (tempfile?.current).split(".")
                                                                        downloadFile(tempfile?.current, tempfile?.filename + "." + pawan[pawan.length - 1])
                                                                    }}
                                                                    style={{ color: "blue", textDecoration: "underline" }}>
                                                                    {tempfile?.filename || "File not found"}
                                                                </a>
                                                                <Form.Select
                                                                    required
                                                                    value=""
                                                                    onChange={(e) => handleInputChange(e, option._id)}
                                                                >

                                                                    <option value="">Select File</option>
                                                                    <option value="">Null</option>
                                                                    {files.map((file, idx) => (
                                                                        <option key={idx} value={file._id}>{file.filename}</option>
                                                                    ))}
                                                                </Form.Select>
                                                                <Form.Select
                                                                    required
                                                                    value=""
                                                                    onChange={(e) => handleInputChange(e, option._id)}
                                                                >
                                                                    {currentAnswer?.prevanswer.map((prevOption, idx) => (
                                                                        <option key={idx} value={prevOption}>{prevOption}</option>
                                                                    ))}
                                                                </Form.Select>

                                                            </>
                                                        )
                                                    ) : (
                                                        option.type === "Text" ? (
                                                            <pre style={{ whiteSpace: "pre-wrap" }}>{currentAnswer?.answer}</pre>
                                                        ) : (
                                                            <a
                                                                onClick={() => {
                                                                    let pawan = (tempfile?.current).split(".")
                                                                    downloadFile(tempfile?.current, tempfile?.filename + "." + pawan[pawan.length - 1])
                                                                }}
                                                                style={{ color: "blue", textDecoration: "underline" }}
                                                            >
                                                                {tempfile?.filename || "File not found"}
                                                            </a>
                                                        )
                                                    )}

                                                </React.Fragment>
                                            </div>
                                        </>

                                    );

                                })
                            }
                            <Col className="text-start">
                                <Button variant="secondary" size="sm" onClick={handleEditSubmit}>Submit</Button>
                            </Col>

                        </Card>
                    </Col>
                    <Col style={{ border: "0px solid red", maxWidth: "5%" }} className="mx-auto">
                        <Button style={{ minHeight: "100%" }} variant="secondary" size="sm" onClick={handleEditSubmit}>Submit</Button>
                    </Col>
                </Row>
            </Container>
        </section>
        {/* faqs */}
          </Tab.Pane>
          {/* Client Section */}
          <Tab.Pane eventKey="clstory" className="py-4">
            <section>
              <Container>
                <Col xs={12} md={4}>
                  {check() && check()[1] === 'john_doe' ? (
                    <Form.Group id="storystatus" className="mb-4">
                      <Form.Label>isDisabled</Form.Label>
                      <InputGroup>
                        <InputGroup.Text></InputGroup.Text>
                        <Form.Select
                          value={isD} // Ensure isDisabled is either "true" or "false"
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            setIsD(String(selectedValue));  // Convert to string and update state
                            storyadd(String(selectedValue)); // Pass the string value to storyadd
                          }}
                        >
                          <option value="">Select Option</option>
                          <option value="true">True</option>  {/* Handle as strings */}
                          <option value="false">False</option> {/* Handle as strings */}
                        </Form.Select>
                      </InputGroup>
                    </Form.Group>
                  ) : (
                    check() ? <p>{check()[1]}</p> : null
                  )}
                </Col>
                <Row>
                  <Col xs={12}>
                    <Card>
                      <Card.Header>Story Management</Card.Header>
                      <Card.Body>
                        {check()?.[0] && (<Button variant="primary" onClick={handleShowModalStory}>
                          Story Telling
                        </Button>)}

                        {/* Table for displaying stories */}
                        <Table striped bordered hover className="mt-3">
                          <thead>
                            <tr>
                              <th className="unselectable" style={{ cursor: "pointer" }} onClick={sortByDateStory} >Date</th>
                              <th>Description</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stories.length > 0 ? (
                              stories
                                // .filter(data => data.type!="office") // Filter stories based on type
                                // .sort((a, b) => a.order - b.order) // Sort stories in ascending order based on `order`
                                .map((story, index) => (
                                  <tr key={story._id} style={{ backgroundColor: story.disabled ? '#f8d7da' : 'inherit' }}>
                                    <td>{new Date(story.date).toLocaleDateString()}</td>
                                    <td style={{ whiteSpace: 'pre-wrap' }}>{story.storyText}</td>
                                    {check()?.[0] && (<td>
                                      <Button
                                        variant="info"
                                        size="sm"
                                        onClick={() => handleEditModalStory(story)}
                                      >
                                        <FontAwesomeIcon icon={faEdit} />
                                      </Button>

                                      <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDeleteStory(id, story._id)}
                                      >
                                        <FontAwesomeIcon icon={faTrash} />
                                      </Button>
                                    </td>)}

                                  </tr>
                                ))
                            ) : (
                              <tr>
                                <td colSpan="4" className="text-center">
                                  No stories available
                                </td>
                              </tr>
                            )}

                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>
              {/* Client story Form Modal */}
              <Modal show={showModal3} onHide={handleCloseModalStory}>
                <Modal.Header closeButton>
                  <Modal.Title>Add New Story</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={(e) => handleSubmitStory(e, "client")}>
                    <Form.Group controlId="formDate">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={createsdate}
                        onChange={(e) => {
                          setCreatesDate(e.target.value)
                          // console.log("hi")
                        }}
                        required
                      />
                    </Form.Group>
                    {/* <Form.Group controlId="formOrderNumber">
                      <Form.Label>Order Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="orderNumber"
                        value={formData.orderNumber}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group> */}
                    <Form.Group controlId="formDescription">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleCloseModalStory}>
                        Close
                      </Button>
                      <Button variant="primary" type="submit">
                        Save
                      </Button>
                    </Modal.Footer>
                  </Form>
                </Modal.Body>
              </Modal>
              {/* Edit Client Story Form Modal */}
              <Modal show={showModal4} onHide={() => setShowModal4(false)} style={{ backgroundColor: "transparent" }}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit File Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="editFileDate">
                      <Form.Label>Story Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={editFileStoryDate}
                        onChange={(e) => setEditFileStoryDate(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId="editFileName">
                      <Form.Label>Story Text</Form.Label>
                      <Form.Control
                        as="textarea"
                        value={editFileStoryText}
                        onChange={(e) => setEditFileStoryText(e.target.value)}
                      />
                    </Form.Group>
                    {/* <Form.Group controlId="editFileOrder">
                      <Form.Label>Order</Form.Label>
                      <Form.Control
                        type="number"
                        value={editFileStoryOrder}
                        onChange={(e) => setEditFileStoryOrder(e.target.value)}
                      />
                    </Form.Group> */}

                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowModal4(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSaveStory}>
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>

            </section>
          </Tab.Pane>
          {/* Story Section */}
          <Tab.Pane eventKey="story" className="py-4">
            <section>
              <Container>
                <Col xs={12} md={4}>
                  {check() && check()[1] === 'john_doe' ? (
                    <Form.Group id="storystatus" className="mb-4">
                      <Form.Label>isDisabled</Form.Label>
                      <InputGroup>
                        <InputGroup.Text></InputGroup.Text>
                        <Form.Select
                          value={isD} // Ensure isDisabled is either "true" or "false"
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            setIsD(String(selectedValue));  // Convert to string and update state
                            storyadd(String(selectedValue)); // Pass the string value to storyadd
                          }}
                        >
                          <option value="">Select Option</option>
                          <option value="true">True</option>  {/* Handle as strings */}
                          <option value="false">False</option> {/* Handle as strings */}
                        </Form.Select>
                      </InputGroup>
                    </Form.Group>
                  ) : (
                    check() ? <p>{check()[1]}</p> : null
                  )}
                </Col>
                <Row>
                  <Col xs={12}>
                    <Card>
                      <Card.Header>Story Management</Card.Header>
                      <Card.Body>
                        {check()?.[0] && (<Button variant="primary" onClick={handleShowModalStory}>
                          Story Telling
                        </Button>)}

                        {/* Table for displaying stories */}
                        <Table striped bordered hover className="mt-3">
                          <thead>
                            <tr>
                              <th className="unselectable" style={{ cursor: "pointer" }} onClick={sortByDateStory} >Date</th>
                              <th>Description</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stories.length > 0 ? (
                              stories
                                // .sort((a, b) => a.order - b.order) // Sort stories in ascending order based on `order`
                                .filter(data => data.type == "client")
                                .map((story, index) => (
                                  <tr key={story._id} style={{ backgroundColor: story.disabled ? '#f8d7da' : 'inherit' }}>
                                    <td>{new Date(story.date).toLocaleDateString()}</td>
                                    <td style={{ whiteSpace: 'pre-wrap' }}>{story.storyText}</td>
                                    <td>
                                      <Button
                                        variant="info"
                                        size="sm"
                                        onClick={() => handleEditModalStory(story)}
                                      >
                                        <FontAwesomeIcon icon={faEdit} />
                                      </Button>

                                      <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDeleteStory(id, story._id)}
                                      >
                                        <FontAwesomeIcon icon={faTrash} />
                                      </Button>
                                    </td>
                                  </tr>
                                ))
                            ) : (
                              <tr>
                                <td colSpan="4" className="text-center">
                                  No stories available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>
              {/* story Form Modal */}
              <Modal show={showModal3} onHide={handleCloseModalStory}>
                <Modal.Header closeButton>
                  <Modal.Title>Add New Story</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={(e) => handleSubmitStory(e, "office")}>
                    <Form.Group controlId="formDate">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={createsdate}
                        onChange={(e) => setCreatesDate(e.target.value)}
                        required
                      />
                    </Form.Group>
                    {/* <Form.Group controlId="formOrderNumber">
                      <Form.Label>Order Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="orderNumber"
                        value={formData.orderNumber}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group> */}
                    <Form.Group controlId="formDescription">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleCloseModalStory}>
                        Close
                      </Button>
                      <Button variant="primary" type="submit">
                        Save
                      </Button>
                    </Modal.Footer>
                  </Form>
                </Modal.Body>
              </Modal>
              {/* Edit Story Form Modal */}
              <Modal show={showModal4} onHide={() => setShowModal4(false)} style={{ backgroundColor: "transparent" }}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit File Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="editFileDate">
                      <Form.Label>Story Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={editFileStoryDate}
                        onChange={(e) => setEditFileStoryDate(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId="editFileName">
                      <Form.Label>Story Text</Form.Label>
                      <Form.Control
                        as="textarea"
                        value={editFileStoryText}
                        onChange={(e) => setEditFileStoryText(e.target.value)}
                      />
                    </Form.Group>
                    {/* <Form.Group controlId="editFileOrder">
                      <Form.Label>Order</Form.Label>
                      <Form.Control
                        type="number"
                        value={editFileStoryOrder}
                        onChange={(e) => setEditFileStoryOrder(e.target.value)}
                      />
                    </Form.Group> */}

                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowModal4(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSaveStory}>
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>

            </section>
          </Tab.Pane>
          {/* Files Section */}
          <Tab.Pane eventKey="profile" className="py-4">
            <Row>
              <Col xs={12} md={4}>
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
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleDelete(id, row._id)}
                      >
                        Edit
                      </Button>
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
            <Table responsive className="align-items-center table-flush">
              <thead className="thead-light">
                <tr>
                  <th className="unselectable" style={{ cursor: "pointer" }} onClick={sortByDateFile}>Date</th>
                  <th scope="col">File</th>
                  <th scope="col">Link</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {midfiles && midfiles
                  // .sort((a, b) => a.order - b.order) // Sort files by order in ascending order
                  .map((row, index) => (
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
                        {row.filename}
                      </td>
                      <td>
                        {/* <a href={row.current} onClick={()=>downloadFile("row.current", "hello.pdf")}download style={{ textDecoration: "underline", color: "blue" }}>Link</a> */}

                        <a onClick={() => {
                          let pawan = (row.current).split(".")
                          // console.log(pawan)
                          downloadFile(row.current, row.filename + "." + pawan[pawan.length - 1])
                        }} style={{ textDecoration: "underline", color: "blue" }}>Link</a>
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
          </Tab.Pane>


          {/* Add Files Section */}
          <Tab.Pane eventKey="Add" className="py-4">
            <section className="d-flex align-items-center my-2 mt-lg-3 mb-lg-5">
              <Container>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  dispatch(addfiles({
                    id: id,
                    date: createdate || undefined,
                    filename: filename,
                    file: selectedFiles || undefined,
                    url: ""
                  }));
                }}>
                  <Row>
                    <Col xs={12} md={6}>
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
                    </Col>
                    <Col xs={12} md={6}>
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
                    </Col>
                    <Col xs={12} md={6}>
                      {filename && (
                        <Form.Group id="Project Image" className="mb-4">
                          <InputGroup>
                            <InputGroup.Text></InputGroup.Text>
                            <Form.Control
                              type="file"
                              onChange={handleFileChange}
                              placeholder="Upload Image"
                            />
                          </InputGroup>
                        </Form.Group>
                      )}
                    </Col>
                    {stop ? (<><Col className="d-flex justify-content-center">
                      <Button variant="primary" type="submit" className="w-100 mt-3">Submit</Button>
                    </Col></>) : (<></>)}
                  </Row>
                </form>
              </Container>
            </section>
          </Tab.Pane>

          {/* Bills Section */}
          <Tab.Pane eventKey="bills" className="py-4">
            <section>
              <Container>
                <Row>
                  <Col xs={12}>
                    <Card>
                      <Card.Header>Bills Information</Card.Header>
                      <Card.Body>
                        <p>Here you can manage and view your bills.</p>
                        <Table responsive>
                          <thead>
                            <tr>
                              <th scope="col">Bill ID</th>
                              <th scope="col">Amount</th>
                              <th scope="col">Date</th>
                              <th scope="col">Subject</th>
                              <th scope="col">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bills.length > 0 ? (
                              bills.map((bill) => (
                                <tr key={bill._id}>
                                  <td>{bill._id}</td>
                                  <td>Rs {bill.amount || 'N/A'}</td>
                                  <td>{new Date(bill.createdAt).toLocaleDateString()}</td>
                                  <td>{bill.subject}</td>
                                  <td>
                                    <Button
                                      variant="info"
                                      size="sm"
                                      onClick={() => handleViewClick(bill)}
                                    >
                                      View
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="text-center">
                                  No bills found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </section>
          </Tab.Pane>

          {/* Modal for viewing bill details */}
          {selectedBill && (
            <Modal show={showModal5} onHide={() => setShowModal5(false)} style={{ backgroundColor: "transparent" }}>
              <Modal.Header closeButton>
                <Modal.Title>Bill Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p><strong>Company:</strong> {selectedBill.company}</p>
                <p><strong>Amount:</strong> Rs {selectedBill.amount}</p>
                <p><strong>Date:</strong> {new Date(selectedBill.createdAt).toLocaleDateString()}</p>
                <p><strong>Subject:</strong> {selectedBill.subject}</p>
                <p><strong>Type:</strong> {selectedBill.type}</p>
                <p><strong>GST:</strong> {selectedBill.gst}</p>
                <p><strong>TDS:</strong> {selectedBill.tds}</p>
                <p><strong>Bank:</strong> {selectedBill.bank}</p>
                <p><strong>Person:</strong> {selectedBill.person}</p>
                <p><strong>Description:</strong> {selectedBill.description}</p>
                <p><strong>Previous:</strong> {selectedBill.previous.map((item, idx) => (
                  <span key={idx}>{item.name}{idx < selectedBill.previous.length - 1 ? ', ' : ''}</span>
                ))}</p>
                <p><strong>URLs:</strong> {selectedBill.urls.map((url, idx) => (
                  <a key={idx} href={url.link} target="_blank" rel="noopener noreferrer">
                    {url.name}
                  </a>
                ))}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          )}

          {/* Task Section */}
          <Tab.Pane eventKey="task" className="py-4">
            <section>
              <Container>
                <Row>
                  <Col xs={12}>
                    <Card>
                      <Card.Header>Task Management</Card.Header>
                      <Card.Body>
                        {tasks && tasks.length > 0 ? (
                          <Table responsive>
                            <thead>
                              <tr>
                                <th scope="col">Task No.</th>
                                <th scope="col">Project ID</th>
                                <th scope="col">Task Details</th>
                                <th scope="col">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tasks.map((task) => (
                                <tr key={task._id}>
                                  <td>{task.nooftask}</td>
                                  <td>{task.projectid}</td>
                                  <td>
                                    <p>{task.taskname || 'No task name provided'}</p>
                                    <p>{task.description || 'No description provided'}</p>
                                  </td>
                                  <td>
                                    <Button variant="primary" onClick={() => handleViewTask(task)}>
                                      View
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        ) : (
                          <p>No tasks available.</p>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>

              {/* Task Details Modal */}
              <Modal show={showModal2} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Task Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedTask ? (
                    <div>
                      <p><strong>Task No:</strong> {selectedTask.nooftask}</p>
                      <p><strong>Project ID:</strong> {selectedTask.projectid}</p>
                      <p><strong>Task Subject:</strong> {selectedTask.taskSubject || 'No subject provided'}</p>
                      <p><strong>Task Description:</strong> {selectedTask.taskDescription || 'No description provided'}</p>
                      <p><strong>Assigned To:</strong> {selectedTask.assignTaskTo.join(', ') || 'No assignees'}</p>
                      <p><strong>Task Completed:</strong> {selectedTask.taskCompleted ? 'Yes' : 'No'}</p>
                      <p><strong>Task URL:</strong> {selectedTask.taskUrl || 'No URL provided'}</p>
                      <p><strong>Created At:</strong> {new Date(selectedTask.CreatedAt).toLocaleString()}</p>
                      <p><strong>Completed At:</strong> {selectedTask.CompletedAt ? new Date(selectedTask.CompletedAt).toLocaleString() : 'Not completed'}</p>
                      <p><strong>Task History:</strong> {selectedTask.taskHistory.length > 0 ? selectedTask.taskHistory.join(', ') : 'No history available'}</p>
                    </div>
                  ) : (
                    <p>Loading task details...</p>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </section>
          </Tab.Pane>

          {/* Contact Section */}
          <Tab.Pane eventKey="contact" className="py-4">
            <section>
              <Container>
                <Form.Group id="people" className="mb-4">
                  <Form.Label>Consultants</Form.Label>
                  <InputGroup>
                    <InputGroup.Text></InputGroup.Text>
                    <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                      <option value="">Select Option</option>
                      {types.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
                <Row>
                  <Col xs={12}>
                    <Card>
                      <Card.Header>Conatct Information</Card.Header>
                      <Card.Body>
                        <p>Here you can view your contact.</p>
                        <Table responsive>
                          <thead>
                            <tr>
                              <th scope="col">Name</th>
                              <th scope="col">Contact No</th>
                              <th scope="col">Email</th>
                              <th scope="col">Type</th>
                              <th scope="col">Description</th>
                              <th scope="col">Project</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredData.length > 0 ? (
                              filteredData.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.name}</td>
                                  <td>{item.phone}</td>
                                  <td>{item.email}</td>
                                  <td>{item.type}</td>
                                  <td>{item.description}</td>
                                  <td>
                                    {item.projects && item.projects.length > 0 ? (
                                      <ul>
                                        {item.projects.map((project, idx) => (
                                          <li key={idx}>{project}</li> // Map through the projects array
                                        ))}
                                      </ul>
                                    ) : (
                                      "No projects"
                                    )}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="6">No data found for this project</td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </section>
          </Tab.Pane>

        </Tab.Content>
      </Tab.Container >

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
      {/* Edit file modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} style={{ backgroundColor: "transparent" }}>
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
  );
};




