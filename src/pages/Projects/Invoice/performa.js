import React, { useState } from 'react';
import { TextField, Grid, Typography, Box, Container } from '@material-ui/core';

function Performa({handleFieldChange,handleGSTChange,formData}) {


  return (
    <Container
      style={{
        display: 'flex',
        alignItems: 'center',
        minHeight: '100vh',
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <Box width="100%">
        <Typography variant="h3" gutterBottom>
          INVOICE
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="BillType"
              label="Bill Type"
              variant="outlined"
              fullWidth
              value={formData.BillType}
              onChange={handleFieldChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="companyName"
              label="Company Name"
              variant="outlined"
              fullWidth
              value={formData.companyName}
              onChange={handleFieldChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="companyPanNo"
              label="Company Pan No."
              variant="outlined"
              fullWidth
              value={formData.companyPanNo}
              onChange={handleFieldChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="state"
              label="State"
              variant="outlined"
              fullWidth
              value={formData.state}
              onChange={handleFieldChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="invoiceNo"
              label="Invoice No."
              variant="outlined"
              fullWidth
              value={formData.invoiceNo}
              onChange={handleFieldChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="receiverName"
              label="Receiver Name"
              variant="outlined"
              fullWidth
              value={formData.receiverName}
              onChange={handleFieldChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="gstin"
              label="GSTIN"
              variant="outlined"
              fullWidth
              value={formData.gstin}
              onChange={handleFieldChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="stateCode"
              label="State Code"
              variant="outlined"
              fullWidth
              value={formData.stateCode}
              onChange={handleFieldChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="receiverAddress"
              label="Receiver Address"
              variant="outlined"
              fullWidth
              value={formData.receiverAddress}
              onChange={handleFieldChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="receiverGstin"
              label="Receiver GSTIN"
              variant="outlined"
              fullWidth
              value={formData.receiverGstin}
              onChange={handleFieldChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="receiverState"
              label="Receiver State"
              variant="outlined"
              fullWidth
              value={formData.receiverState}
              onChange={handleFieldChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="projectNo"
              label="Project No."
              variant="outlined"
              fullWidth
              value={formData.projectNo}
              onChange={handleFieldChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="invoiceDate"
              label="Invoice Date"
              variant="outlined"
              fullWidth
              value={formData.invoiceDate}
              onChange={handleFieldChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="projectReferenceNo"
              label="Project Reference No."
              variant="outlined"
              fullWidth
              value={formData.projectReferenceNo}
              onChange={handleFieldChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="workOrderNo"
              label="Work Order No."
              variant="outlined"
              fullWidth
              value={formData.workOrderNo}
              onChange={handleFieldChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="particulars"
              label="Particulars"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              value={formData.particulars}
              onChange={handleFieldChange}
              inputProps={{ style: { whiteSpace: 'pre-wrap' } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="amtRs"
              label="AMT. (Rs)"
              variant="outlined"
              fullWidth
              value={formData.amtRs}
              onChange={handleFieldChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="amtWords"
              label="Rs. In Words"
              variant="outlined"
              fullWidth
              value={formData.amtWords}
              onChange={handleFieldChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="cgst"
              label="CGST"
              variant="outlined"
              fullWidth
              value={formData.cgst}
              onChange={handleFieldChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <button
              onClick={handleGSTChange}
              style={{
                marginTop: '16px',
                padding: '16px',
                width: '100%',
                border: '1px solid #ccc',
                background: '#f5f5f5',
                cursor: 'pointer',
              }}
            >
              {formData.gst ? 'Disable GST' : 'Enable GST'}
            </button>
          </Grid>
          {formData.gst && (
            <Grid item xs={12} sm={6}>
              <TextField
                id="sgst"
                label="SGST"
                variant="outlined"
                fullWidth
                value={formData.sgst}
                onChange={handleFieldChange}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <TextField
              id="tot"
              label="Total"
              variant="outlined"
              fullWidth
              value={formData.tot}
              onChange={handleFieldChange}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Performa;
