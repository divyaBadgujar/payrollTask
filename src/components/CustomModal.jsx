import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CustomModal = ({
  open,
  onClose,
  title,
  children,
  handleSubmit,
  maxWidth = 'sm',
  fullWidth = true,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      aria-labelledby="custom-modal-title"
    >
      <DialogTitle id="custom-modal-title">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          {title}
          <IconButton 
            onClick={onClose} 
            aria-label="close"
            sx={{ p: 0 }}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent dividers sx={{ display : "flex", justifyContent : "center", alignItems : "center"}}>
        {children}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
            Cancel
          </Button>,
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
          >
            Done
          </Button>
        </DialogActions>
    </Dialog>
  );
};

export default CustomModal;