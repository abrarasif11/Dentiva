import { getUserAppointments } from "@/lib/actions/appointments";

async function NextAppointment() {
  const appointment = await getUserAppointments();
  return (
    <div>
      <p>NextAppointment</p>
    </div>
  );
}

export default NextAppointment;
