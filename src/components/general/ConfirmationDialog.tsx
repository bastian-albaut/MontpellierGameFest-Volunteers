import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const ConfirmationDialog = (props: any) => {
  const handleClose = () => {
    if (props.onCancel) {
      props.onCancel();
    }
  };

  const handleConfirm = () => {
    if (props.onConfirm) {
      props.onConfirm();
    }
  };

  return (
    <Dialog open={props.open} onClose={handleClose}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Annuler
        </Button>
        <Button onClick={handleConfirm} color="primary" autoFocus>
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;