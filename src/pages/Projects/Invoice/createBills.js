import React, { useState } from 'react';
import Performa from './performa'
import ProformaInvoice from './NeoModern';
// import VivekProformaInvoice from './Bill/VivekPerfoma';
// import BzTech from './Bill/BzTech';
// import BzCounsaltant from './Bill/BzCounsaltant';
// import VivekBholeArc from './Bill/VivekBholeArc';
// import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

function Collecting() {
    const [selectedInvoice, setSelectedInvoice] = useState('BzCounsaltant');
    // const navigate = useNavigate();

    const handleSelectChange = (event) => {
        setSelectedInvoice(event.target.value);
    };

    const handleLogout = () => {
        localStorage.clear(); // Clear all data in local storage
        // navigate('/'); // Redirect to login page
    };


      const [formData, setFormData] = useState({
          receiverName: '',
          receiverAddress: '',
          companyName: '',
          companyPanNo: '',
          gstin: '',
          invoiceDate: '',
        BillType: '',
        state: 'Maharashtra',
        invoiceNo: '',
        receiverGstin: '',
        receiverState: '',
        stateCode: '27',
        projectNo: '',
        projectReferenceNo: '',
        workOrderNo: '',
        particulars: '',
        amtRs: '',
        amtWords: '',
        cgst: '',
        sgst: '',
        tot: '',
        gst: true,
      });
    
      const handleFieldChange = (event) => {
        const { id, value } = event.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
      };
    
      const handleGSTChange = () => {
        setFormData((prev) => ({ ...prev, gst: !prev.gst }));
      };

    return (
        <div>
            {/* <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <select 
                    onChange={handleSelectChange} 
                    value={selectedInvoice}
                    style={{ fontSize: '20px', padding: '10px' }}
                >
                    <option value="NeoMorden">Neo Modern</option>
                    <option value="VivekBholeConsultant">Vivek Bhole Consultant</option>
                    <option value="BzCounsaltant">Bz Counsaltant</option>
                    <option value="Bztech">Bz tech</option>
                    <option value="VivekBholeArc">Vivek Bhole Arc</option>
                </select>
            </div>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <button 
                    onClick={handleLogout}
                    style={{ fontSize: '16px', padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                    Logout
                </button>
            </div> */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ marginRight: '20px' }}>
                    <Performa handleFieldChange={handleFieldChange} handleGSTChange={handleFieldChange} formData={formData}/>
                </div>
                <div style={{ flex: 1,font:"Century Gothic" }}>
                    <ProformaInvoice formData={formData} />
                    {/* {selectedInvoice === 'VivekBholeConsultant' && <VivekProformaInvoice />}
                    {selectedInvoice === 'BzCounsaltant' && <BzCounsaltant />}
                    {selectedInvoice === 'Bztech' && <BzTech />}
                    {selectedInvoice === 'VivekBholeArc' && <VivekBholeArc />} */} 
                </div>
            </div>
        </div>
    );
}

export default Collecting;
