import { triggerFunction } from "./SignedUrl";
const handleFileChange = async (event,foldername,setstop) => {
    const files = event.target.files;
    let selectedFiles = [];
    const newSelectedFiles = [];
    setstop(false)
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file) {
        // Read file extension
        const fileExtension = file.name;
        const arr1 = await triggerFunction(fileExtension, foldername.trim());
        // Add arr1[0] and arr1[1] to the newSelectedFiles array
        newSelectedFiles.push([arr1[0], arr1[1], file]);
      }
    }
    // After the loop, update selectedFiles with the accumulated data
    selectedFiles=newSelectedFiles
    // Check the result
    setstop(true)
    return selectedFiles
  };
  

  export default handleFileChange