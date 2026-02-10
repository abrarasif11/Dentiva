interface AddDoctorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddDoctorDialog({ isOpen, onClose }: AddDoctorDialogProps) {
  return (
    <div>
      <p>AddDoctorDialog</p>
    </div>
  );
}

export default AddDoctorDialog;
