import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  baseStyle,
  baseLetterheadStyle,
  baseSealStyle,
  baseStampStyle,
  companies
} from './CompanyInvoicePage'; // adjust path if needed

const InvoiceGeneratorPage = ({formData}) => {
  const performa = formData
  const invoiceRef = useRef(null);
  const [selectedCompany, setSelectedCompany] = useState('neoModern');

  const company = companies[selectedCompany];

  const downloadInvoice = () => {
    const invoiceElement = invoiceRef.current;
    html2canvas(invoiceElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      pdf.save(`${company.name}_invoice.pdf`);
    });
  };

  const pageStyle = {
    ...baseStyle,
    backgroundImage: company.backgroundImage ? `url(${company.backgroundImage})` : undefined
  };

  const letterheadStyle = company.letterheadStyle || baseLetterheadStyle;
  const sealStyle = company.sealStyle || { ...baseSealStyle, height: company.sealHeight };
  const stampStyle = company.stampStyle || baseStampStyle;

  return (
    <div >
      <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
        {Object.entries(companies).map(([key, comp]) => (
          <option key={key} value={key}>{comp.name}</option>
        ))}
      </select>

      

      <button style={{ marginTop: '20px', width: '100%', height: '40px' }} onClick={downloadInvoice}>Download PDF</button>
    
      <div>
            {/* Header Section */}
            <div ref={invoiceRef} style={pageStyle}>

                <div
                    style={{
                        textAlign: 'center',
                        marginBottom: '0px',
                        padding: '10px',
                        backgroundColor: '#fff',
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        opacity: 1 // Optional: Add slight opacity to make text more readable
                    }}
                >
                    {/* Image */}
                    <img src={company.letterheadSrc} alt="Letterhead" style={letterheadStyle} />

                    {/* Text */}
                </div>

                <div style={{ textAlign: 'center', marginBottom: '0', border: '1px solid black', padding: '0px' }}>
                    <h1>{performa.BillType}</h1>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0' }}>
                    <div style={{ width: '75%', border: '1px solid black', padding: '10px' }}>
                        <p>
                            <strong>Company Name :</strong> {performa.companyName}
                        </p>
                        <p>
                            <strong>Company Pan No. :</strong> {performa.companyPanNo}
                        </p>
                        <p>
                            <strong>State :</strong> {performa.state}
                        </p>
                        <p>
                            <strong>Invoice No. :</strong> {performa.invoiceNo}
                        </p>
                    </div>
                    <div style={{ width: '38.5%', border: '1px solid black', padding: '10px' }}>
                        <p>
                            <strong>GSTIN :</strong> {performa.gstin}
                        </p>
                        <p>
                            <strong>State Code :</strong> {performa.stateCode}
                        </p>
                        <p>
                            <strong>Invoice Date :</strong> {performa.invoiceDate}
                        </p>
                    </div>
                </div>
                <div style={{ marginBottom: '0', padding: '10px', border: '1px solid black' }}>
                    <p>
                        <strong>Receiver Name :</strong> {performa.receiverName}
                    </p>
                    <p>
                        <strong>Address :</strong> {performa.receiverAddress}
                    </p>
                    <p>
                        <strong>GSTIN :</strong> {performa.receiverGstin}
                    </p>
                    <p>
                        <strong>State :</strong> {performa.receiverState}
                    </p>
                    <p>
                        <strong>Project No. :</strong> {performa.projectNo}
                    </p>
                    <p>
                        <strong>Project Reference No. :</strong> {performa.projectReferenceNo}
                    </p>
                    <p>
                        <strong>Work Order No. :</strong> {performa.workOrderNo}
                    </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0' }}>
                    <div style={{ width: '75%', border: '1px solid black', padding: '10px' }}>
                        <p>
                            <strong>SAC Code :</strong> {performa.sac_code}
                        </p>
                        <p style={{ whiteSpace: 'pre-wrap' }}>
                            <strong>Particulars:</strong> {performa.particulars}
                        </p>
                    </div>
                   <div style={{ width: '38.5%', border: '1px solid black', padding: '10px' }}>
                        <p>
                            <strong>AMT. (Rs)</strong> {performa.amtRs.toLocaleString()}
                        </p>
                        {performa.gst && (<><p style={{ fontSize: '12px', marginTop: '100px' }}>
                            <strong>CGST @9% :</strong> {performa.cgst.toLocaleString()}
                        </p>
                        <p style={{ fontSize: '12px' }}>
                            <strong>SGST @9% :</strong> {performa.sgst.toLocaleString()}
                        </p></>)}
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0' }}>
                    <div style={{ width: '75%', border: '1px solid black', padding: '10px' }}>
                        <p>
                            <strong>In Words :</strong> {performa.amtWords}
                        </p>
                    </div>
                    <div style={{ width: '38.5%', border: '1px solid black', padding: '10px' }}>
                        <p>
                            <strong>Total AMT. (Rs):</strong> {performa.tot.toLocaleString()}
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex',  border: '1px solid black',justifyContent: 'space-between', marginBottom: '0' }}>
                    <div style={{ width: '75%', borderRight: '1px solid black', padding: '10px' }}>
                        <p>
                            <strong> Bank Details :</strong> AXIS Bank Ltd
                        </p>
                        <p>
                            <strong> A/c Name :</strong>  Vivek Bhole Consultants Pvt Ltd
                        </p>
                        <p>
                            <strong> A/C No. :</strong> 919020012575070
                        </p>
                        <p>
                            <strong>IFSC CODE :</strong> UTIB0000395
                        </p>
                    </div>
                    <div style={{ width: '45%',  padding: '10px', height: '230px' }}>
                    <img src={company.sealSrc} alt={company.sealAlt} style={sealStyle} />

                        <p style={{ marginTop: '5px', textAlign: 'center' }}>
                            <strong>Common Seal</strong>
                        </p>
                    </div>
                    <div style={{ width: '65%', borderLeft: '1px solid black', padding: '10px', textAlign: 'center' }}>
                        <p>
                        <strong>{company.stampTitle}</strong>
                        </p>
                        {/* <img
                            src="https://res.cloudinary.com/dlwot6rlr/image/upload/c_thumb,w_200,g_face/v1724228826/bhau-removebg-preview_fwuvmc.png" // Replace with the actual URL or local path
                            alt="Company Logo"
                            style={{
                                width: '160px', // Adjust the width as needed
                                display: 'block',
                                margin: '0 auto' // Centers the image horizontally
                            }}
                        /> */}
                                    <img src={company.stampSrc} alt={company.stampAlt} style={stampStyle} />

                        <p style={{ marginTop: '30px' }}>
                            <strong>(Authorised Signatory)</strong>
                        </p>
                    </div>

                </div>

            </div>
            <button style={{ marginTop: '10px', height: '40px', width: '100%' }} onClick={downloadInvoice}>Download PDF</button>
        </div>
    
    </div>
    
  );
};

export default InvoiceGeneratorPage;
