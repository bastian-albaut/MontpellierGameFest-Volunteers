import React, { useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { useDropzone } from 'react-dropzone';
import styles from '../../styles/components/loginRegister/fileInput.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import variables from '../../styles/abstract/variables.module.scss';

function FileInput(props) {
    const { selectedFile, setSelectedFile } = props;
  
    const handleDrop = (acceptedFiles) => {
        setSelectedFile(acceptedFiles[0]);
    };
  
    // Remove the selected file if the user clicks on the remove icon
    const handleRemove = (e) => {
        e.stopPropagation();    
        setSelectedFile(null);
    };
  
    // Configuration of the dropzone
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        onDrop: handleDrop,
        accept: '.xlsx, .csv',
    });
  
    return (
      <Box
        id={styles['fileInputContainer']}
        {...getRootProps({
          className: `dropzone ${
            isDragActive ? 'isDragActive' : ''
          } ${
            isDragAccept ? 'isDragAccept' : ''
          } ${
            isDragReject ? 'isDragReject' : ''
          }`,
        })}
      >
        <input {...getInputProps()} />
        {selectedFile ? (
                            <>
                                <IconButton onClick={handleRemove} aria-label="Remove file" size="small">
                                    <CloseIcon />
                                </IconButton>
                                <Box id={styles['fileInputPreview']}>
                                        <FontAwesomeIcon icon={faFileExcel} size='4x' color={variables.greyColor}/>
                                </Box>
                                <Typography id={styles['fileInputLabel']}>
                                    {`Fichier sélectionné: ${selectedFile.name}`}
                                </Typography>
                                <Typography id={styles['fileInputLabel']}>
                                        {`(${(selectedFile.size / 1024).toFixed(2)} ko)`}
                                </Typography>
                            </>
        ) : (
            <>
            <CloudUploadIcon />
            <Typography id={styles['fileInputLabel']}>
                Faites glisser ou cliquez pour sélectionner votre fichier CSV.
            </Typography>
          </>
        )}
      </Box>
    );
}
  
export default FileInput;