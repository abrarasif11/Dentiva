"use client";

import ProgressSteps from "@/components/appointments/ProgressSteps";
import Navbar from "@/components/Navbar";
import { useState } from "react";

function AppointmentPages() {
  // state management for the booking process - this could be done with something like Zustand for larger apps
  const [selectedDentistId, setSelectedDentistId] = useState<string | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // 1: select dentist, 2: select time, 3: confirm
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<any>(null);

  const handleSelectDentist = (dentistId: string) => {};

  const handleBookAppointment = async () => {};

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        {/* header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book an Appointment</h1>
          <p className="text-muted-foreground">
            Find and book with verified dentists in your area
          </p>
        </div>
        <ProgressSteps currentStep={currentStep} />
      </div>
    </>
  );
}

export default AppointmentPages;
