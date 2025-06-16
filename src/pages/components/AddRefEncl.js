import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseurl } from "../../api";
import Swal from 'sweetalert2'
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import { useSelector, useDispatch } from 'react-redux';
import { triggerFunction, getPredefinedUrl } from '../../components/SignedUrl';
import { addcorrespondence, getcorrespondence } from "../../features/correspondenceSlice";
export default ({ corr, allcorr, setcorr, showModal2, setShowModal2 }) => {

  const [texthistory, setaddtexthistory] = useState("")
  let [selectedFiles, setSelectedFiles] = useState([])
  let [stop, setStop] = useState(true)
  let [filename, setfilename] = useState("")
  let [temp, settemp] = useState("")
  let [refto, setrefto] = useState([])
  let [enclosedto, setenclosedto] = useState([])
  let [replyto, setreplyto] = useState([])
  let [selectedvalue, setSelectedValue] = useState("")


  // common for all
  const dispatch = useDispatch();


  useEffect(() => {
    setrefto([])
    setenclosedto([])
    setreplyto([])
    ////console.log(allcorr)
    // //////console.log(corr.refto)
    if (corr.refto) {
      setrefto(corr.refto)
    }
    if (corr.enclose) {
      setenclosedto(corr.enclosed)
    }
    if (corr.reply) {
      setreplyto(corr.reply)
    }

  }, [showModal2])

  const handleaddhistorysubmit = async (e) => {
    e.preventDefault();
    //////console.log("Submitting form...");

    // First API for Updating References
    const body = { refto };
    try {
      const response1 = await axios.put(`${baseurl}/correspondence/updateref/${corr._id}`, body);
      //////console.log("References updated:", response1.data);
    } catch (error) {
      console.error("Error updating references:", error.response ? error.response.data : error.message);
    }

    // Second API for Updating Enclosures
    const body2 = { enclosedto };
    try {
      const response2 = await axios.put(`${baseurl}/correspondence/updateenclosure/${corr._id}`, body2);
      //////console.log("Enclosures updated:", response2.data);
    } catch (error) {
      console.error("Error updating enclosures:", error.response ? error.response.data : error.message);
    }

    // Third API for Updating Correspondence
    const body3 = { replyto };
    try {
      const response3 = await axios.put(`${baseurl}/correspondence/updatereply/${corr._id}`, body3);
      //////console.log("Correspondence updated:", response3.data);
    } catch (error) {
      console.error("Error updating correspondence:", error.response ? error.response.data : error.message);
    }

    // Dispatch and Update State
    try {
      const resp = await dispatch(getcorrespondence());
      setcorr(resp);
      //////console.log("Correspondence data updated:", resp);
    } catch (error) {
      console.error("Error fetching correspondence data:", error.response ? error.response.data : error.message);
    }

    setShowModal2(false);

    // Third API for Updating Both (Uncomment if needed)
    // try {
    //   const response3 = await axios.put(`${baseurl}/correspondence/updatefrom/${corr._id}`, body);
    //   //////console.log("Both updated:", response3.data);
    // } catch (error) {
    //   console.error("Error updating both:", error.response ? error.response.data : error.message);
    // }
  };


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
        // setSelectedFile(file);
        // setFileExtension(fileExtension);

        const arr1 = await triggerFunction(fileExtension, (corr.projectname).trim());
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
  // for Refto
  const handleReftoChange = (e) => {
    //////console.log(refto)
    // const selectedOption = {
    //   id: e.target.value,
    //   name: e.target.selectedOptions[0].text,
    // };
    for (let i = 0; i < refto.length; i++) {
      //////console.log(refto[i], e.target.value)
      if (refto[i] === e.target.value) {
        toast.error("Already Added")
        return;
      }
    }
    if (e.target.value == corr._id) {
      toast.error("Can't Refer Self")
      return;
    }
    setSelectedValue(e.target.value);
    setrefto((prevSelected) => [...prevSelected, e.target.value]);
    toast.success("Added Successfully");
  };

  // for enclosure
  const handleenclosureChange = (e) => {
    //////console.log(e.target.value)
    // const selectedOption = {
    //   id: e.target.value,
    //   name: e.target.selectedOptions[0].text,
    // };
    setSelectedValue(e.target.value);
    for (let i = 0; i < enclosedto.length; i++) {
      if (enclosedto[i].id === e.target.value) {
        toast.error("Already Added")
        return;
      }
    }
    if (e.target.value == corr._id) {
      toast.error("Can't Refer Self")
      return;
    }
    setenclosedto((prevSelected) => [...prevSelected, e.target.value]);
    toast.success("Added Successfully");
  };

  // for reply
  const handleReplyChange = (e) => {
    //////console.log(e.target.value)
    // const selectedOption = {
    //   id: e.target.value,
    //   name: e.target.selectedOptions[0].text,
    // };
    setSelectedValue(e.target.value);
    for (let i = 0; i < replyto.length; i++) {
      if (replyto[i].id === e.target.value) {
        toast.error("Already Added")
        return;
      }
    }
    if (e.target.value == corr._id) {
      toast.error("Can't Refer Self")
      return;
    }
    setreplyto((prevSelected) => [...prevSelected, e.target.value]);
    toast.success("Added Successfully");
  };

  const handleRemove = (id) => {
    //////console.log(id)
    // for()
    const newSelected = [];
    for (let i = 0; i < refto.length; i++) {
      if (refto[i] !== id) {
        newSelected.push(refto[i]);
      }
    }
    //////console.log(newSelected)
    setTimeout(() => {
      setrefto(newSelected);
    }, 50);


  };

  const handleRemove1 = (id) => {
    //////console.log(id)
    // for()
    const newSelected = [];
    for (let i = 0; i < enclosedto.length; i++) {
      if (enclosedto[i] !== id) {
        newSelected.push(enclosedto[i]);
      }
    }
    //////console.log(newSelected)
    setTimeout(() => {
      setenclosedto(newSelected);
    }, 50);
  };

  const handleRemove2 = (id) => {
    //////console.log(id)
    // for()
    const newSelected = [];
    for (let i = 0; i < replyto.length; i++) {
      if (replyto[i] !== id) {
        newSelected.push(replyto[i]);
      }
    }
    //////console.log(newSelected)
    setTimeout(() => {
      setreplyto(newSelected);
    }, 50);
  };

  return (
    <>
      <ToastContainer />
      <Modal className="#modal-content" style={{ width: "100%" }} show={showModal2} onHide={() => setShowModal2(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Add Correspondence History
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>

          {/* Add File */}
          {/* <Form.Group id="Project Image" className="mb-4">
                    <Form.Label>File</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>
                        </InputGroup.Text>
                        <Form.Control
                        type="file"
                        onChange={handleFileChange}
                        placeholder="Upload Image"
                        />
                    </InputGroup>
            </Form.Group> */}

          {/* Reference to */}
          <Form.Group id="pname" className="mb-4">

            <Form.Label>References</Form.Label>
            <InputGroup>
              <InputGroup.Text>
              </InputGroup.Text>
              <Form.Select value={temp} onChange={(e) => handleReftoChange(e)}>
                <option value="">Select Option</option>
                {/* Mapping through the arr array to generate options */}
                {allcorr.map((option, index) => (
                  <option key={index} value={option._id}>{option.letterno}-{option.subject}</option>
                ))}
              </Form.Select>
            </InputGroup>
            <Form.Label>
              <ul style={{ listStyleType: 'none' }}>
                {refto && refto.map((document, index) => {
                  const name = allcorr.find(value => value._id === document);
                  return (
                    <div key={index} style={{ marginBottom: '5px', paddingLeft: '20px', textIndent: '-15px' }}>
                      <li>
                        • <a style={{ textDecoration: "underline" }} >{name?.letterno}-{name?.subject}</a>
                        <button onClick={() => handleRemove(document)} style={{ marginLeft: '5px', marginTop: '10px' }}>
                          x
                        </button>
                      </li>

                    </div>
                  );
                })}
              </ul>
            </Form.Label>
          </Form.Group>
          {/* encloser from */}
          <Form.Group id="pname" className="mb-4">
            <Form.Label>Enclosed</Form.Label>
            <InputGroup>
              <InputGroup.Text>
              </InputGroup.Text>
              <Form.Select value={temp} onChange={(e) => handleenclosureChange(e)}>
                <option value="">Select Option</option>
                {/* Mapping through the arr array to generate options */}
                {allcorr.map((option, index) => (
                  <option key={index} value={option._id}>{option.letterno}-{option.subject}</option>
                ))}
              </Form.Select>
            </InputGroup>
            <Form.Label>
              <ul style={{ listStyleType: 'none' }}>
                {enclosedto && enclosedto.map((document, index) => {
                  const name = allcorr.find(value => value._id === document);
                  return (
                    <div key={index} style={{ marginBottom: '5px', paddingLeft: '20px', textIndent: '-15px' }}>
                      <li>
                        • <a style={{ textDecoration: "underline" }} >{name?.letterno}-{name?.subject}</a>
                        <button onClick={() => handleRemove1(document)} style={{ marginLeft: '5px', marginTop: '10px' }}>
                          x
                        </button>
                      </li>
                    </div>
                  );
                })}
              </ul>
            </Form.Label>
          </Form.Group>
          {/* encloser from */}
          <Form.Group id="pname" className="mb-4">
            <Form.Label>Reply</Form.Label>
            <InputGroup>
              <InputGroup.Text>
              </InputGroup.Text>
              <Form.Select value={temp} onChange={(e) => handleReplyChange(e)}>
                <option value="">Select Option</option>
                {/* Mapping through the arr array to generate options */}
                {allcorr.map((option, index) => (
                  <option key={index} value={option._id}>{option.letterno}-{option.subject}</option>
                ))}
              </Form.Select>
            </InputGroup>
            <Form.Label>
              <ul style={{ listStyleType: 'none' }}>
                {replyto && replyto.map((document, index) => {
                  const name = allcorr.find(value => value._id === document);
                  return (
                    <div key={index} style={{ marginBottom: '5px', paddingLeft: '20px', textIndent: '-15px' }}>
                      <li>
                        • <a style={{ textDecoration: "underline" }} >{name?.letterno}-{name?.subject}</a>
                        <button onClick={() => handleRemove2(document)} style={{ marginLeft: '5px', marginTop: '10px' }}>
                          x
                        </button>
                      </li>

                    </div>
                  );
                })}
              </ul>
            </Form.Label>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal2(false)}>
            Cancel
          </Button>
          <Button style={{ backgroundColor: "greenyellow" }} variant="secondary" onClick={(e) => handleaddhistorysubmit(e)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>

  )
}


