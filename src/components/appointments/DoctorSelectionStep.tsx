import React from "react";

interface DoctorSelectionStepProps {
  selectedDentistId: string | null;
  onSelectDentist: (dentistId: string) => void;
  onContinue: () => void;
}
function DoctorSelectionStep({
  onContinue,
  onSelectDentist,
  selectedDentistId,
}: DoctorSelectionStepProps) {
  return (
    <div>
      <p>DoctorSelectionStep</p>
    </div>
  );
}

export default DoctorSelectionStep;
