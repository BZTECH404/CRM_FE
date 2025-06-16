const baseStyle = {
    fontFamily: 'Arial, sans-serif',
    width: '210mm',
    minHeight: '297mm',
    margin: 'auto',
    border: '1px solid black',
    padding: '10mm',
    boxSizing: 'border-box',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };
  
  const baseLetterheadStyle = {
    width: '195mm',
    marginBottom: '0px'
  };
  
  const baseSealStyle = {
    borderRadius: '50%',
    width: '160px',
    display: 'block',
    margin: '0 auto'
  };
  
  const baseStampStyle = {
    width: '160px',
    display: 'block',
    margin: '0 auto'
  };
  
  const companies = {
    neoModern: {
      name: "Neo Modern Consultant",
      backgroundImage: 'https://res.cloudinary.com/dlwot6rlr/image/upload/v1724235276/Frame_25_hqmfar.jpg',
      letterheadSrc: 'https://res.cloudinary.com/dlwot6rlr/image/upload/v1724230264/Frame_24_vqqjpl.png',
      sealSrc: 'https://res.cloudinary.com/dlwot6rlr/image/upload/v1724238382/Screenshot_2024-08-21_161443_cwj8oz.png',
      sealHeight: '140px',
      sealAlt: 'Neo Modern Seal',
      stampTitle: 'For Neo Modern Consultant',
      stampSrc: 'https://res.cloudinary.com/dlwot6rlr/image/upload/c_thumb,w_200,g_face/v1724228826/bhau-removebg-preview_fwuvmc.png',
      stampAlt: 'Neo Modern Stamp'
    },
    bzConsultants: {
      name: "BZ CONSULTANTS PVT LTD",
      letterheadSrc: 'https://res.cloudinary.com/dlwot6rlr/image/upload/v1724313409/Frame_26_ovt9xt.png',
      sealSrc: 'https://res.cloudinary.com/dlwot6rlr/image/upload/v1724414278/Screenshot_2024-08-23_172656_o8hzmu.png',
      sealHeight: '120px',
      sealAlt: 'BZ Seal',
      stampTitle: 'For BZ CONSULTANTS PVT LTD',
      stampSrc: 'https://res.cloudinary.com/dlwot6rlr/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1724405265/Screenshot_2024-08-23_145523_wkmoxx.png',
      stampAlt: 'BZ Stamp'
    },
    bzTech: {
      name: "B Z TECHNOLOGIES LLP",
      letterheadSrc: 'https://res.cloudinary.com/dlwot6rlr/image/upload/v1724318786/Frame_27_vnupuj.png',
      letterheadStyle: { width: '200mm', marginBottom: '0px' },
      sealSrc: 'https://res.cloudinary.com/dlwot6rlr/image/upload/c_thumb,w_200,g_face/v1724413869/Screenshot_2024-08-23_171713_gnhlqp.png',
      sealHeight: '120px',
      sealAlt: 'BZ Tech Seal',
      stampTitle: 'For B Z TECHNOLOGIES LLP',
      stampSrc: 'https://res.cloudinary.com/dlwot6rlr/image/upload/v1724318939/Sign_remove_bg_pvl7pw.png',
      stampAlt: 'BZ Tech Stamp',
      stampStyle: { width: '130px', display: 'block', margin: '0 auto' }
    },
    vivekBhole: {
      name: "Vivek Bhole Architect Pvt. Ltd",
      backgroundImage: 'https://res.cloudinary.com/dlwot6rlr/image/upload/v1724235276/Frame_25_hqmfar.jpg',
      letterheadSrc: 'https://res.cloudinary.com/dlwot6rlr/image/upload/v1724313158/artitect_wvqxiq.png',
      sealSrc: 'https://res.cloudinary.com/dlwot6rlr/image/upload/c_thumb,w_200,g_face/v1724310985/Screenshot_2024-08-22_124355_xmu3ef.png',
      sealHeight: '130px',
      sealAlt: 'Vivek Bhole Seal',
      stampTitle: 'For Vivek Bhole Architect Pvt. Ltd',
      stampSrc: 'https://res.cloudinary.com/dlwot6rlr/image/upload/c_thumb,w_200,g_face/v1724228826/bhau-removebg-preview_fwuvmc.png',
      stampAlt: 'Vivek Bhole Stamp'
    },
    vivekConsultant: {
      name: "Vivek Bhole Consultants Pvt Ltd",
      backgroundImage: 'https://res.cloudinary.com/dlwot6rlr/image/upload/v1724235276/Frame_25_hqmfar.jpg',
      letterheadSrc: 'https://res.cloudinary.com/dlwot6rlr/image/upload/v1724233936/vivekbhole_cb8gmk.png',
      letterheadStyle: { width: '200mm', marginBottom: '0px' },
      sealSrc: 'https://res.cloudinary.com/dlwot6rlr/image/upload/v1724238120/Screenshot_2024-08-21_161507_vearms.png',
      sealHeight: '180px',
      sealAlt: 'Vivek Consultant Seal',
      sealStyle: { width: '150px', display: 'block', margin: '0 auto', borderRadius: '50%' },
      stampTitle: 'For Vivek Bhole Consultant Pvt Ltd',
      stampSrc: 'https://res.cloudinary.com/dlwot6rlr/image/upload/c_thumb,w_200,g_face/v1724228826/bhau-removebg-preview_fwuvmc.png',
      stampAlt: 'Vivek Consultant Stamp'
    }
  };


export { companies, baseStyle, baseLetterheadStyle, baseSealStyle, baseStampStyle };

