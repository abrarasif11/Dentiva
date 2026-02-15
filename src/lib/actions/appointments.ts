"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "../prisma";
import { AppointmentStatus } from "@prisma/client";

// Transform appointments to include doctor & patient info
function transformAppointment(appointment: any) {
  return {
    ...appointment,
    patientName:
      `${appointment.user.firstName || ""} ${appointment.user.lastName || ""}`.trim(),
    patientEmail: appointment.user.email,
    doctorName: appointment.doctor.name,
    doctorImageUrl: appointment.doctor.imageUrl || "",
    date: appointment.date.toISOString().split("T")[0],
  };
}

// Utility: auto-create user if missing
async function getOrCreateUser(userId: string) {
  let user = await prisma.user.findUnique({ where: { clerkId: userId } });

  if (!user) {
    const clerkUser = await currentUser();
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser?.emailAddresses?.[0]?.emailAddress ?? "",
        firstName: clerkUser?.firstName ?? "",
        lastName: clerkUser?.lastName ?? "",
      },
    });
  }

  return user;
}

// Get all appointments
export async function getAppointments() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        doctor: { select: { name: true, imageUrl: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return appointments.map(transformAppointment);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw new Error("Failed to fetch appointments");
  }
}

// Get appointments for the currently logged-in user
export async function getUserAppointments() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("You must be logged in to view appointments");

    const user = await getOrCreateUser(userId);

    const appointments = await prisma.appointment.findMany({
      where: { userId: user.id },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        doctor: { select: { name: true, imageUrl: true } },
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });

    return appointments.map(transformAppointment);
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    throw new Error("Failed to fetch user appointments");
  }
}

// Get user appointment stats
export async function getUserAppointmentStats() {
  try {
    const { userId } = await auth();
    if (!userId) return { totalAppointments: 0, completedAppointments: 0 };

    const user = await getOrCreateUser(userId);

    const [totalCount, completedCount] = await Promise.all([
      prisma.appointment.count({ where: { userId: user.id } }),
      prisma.appointment.count({
        where: { userId: user.id, status: "COMPLETED" },
      }),
    ]);

    return {
      totalAppointments: totalCount,
      completedAppointments: completedCount,
    };
  } catch (error) {
    console.error("Error fetching user appointment stats:", error);
    return { totalAppointments: 0, completedAppointments: 0 };
  }
}

// Get booked time slots for a doctor on a specific date
export async function getBookedTimeSlots(doctorId: string, date: string) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: new Date(date),
        status: { in: ["CONFIRMED", "COMPLETED"] },
      },
      select: { time: true },
    });

    return appointments.map((a) => a.time);
  } catch (error) {
    console.error("Error fetching booked time slots:", error);
    return [];
  }
}

// Book a new appointment
interface BookAppointmentInput {
  doctorId: string;
  date: string;
  time: string;
  reason?: string;
}

export async function bookAppointment(input: BookAppointmentInput) {
  try {
    const { userId } = await auth();
    if (!userId)
      throw new Error("You must be logged in to book an appointment");

    if (!input.doctorId || !input.date || !input.time) {
      throw new Error("Doctor, date, and time are required");
    }

    const user = await getOrCreateUser(userId);

    const appointment = await prisma.appointment.create({
      data: {
        userId: user.id,
        doctorId: input.doctorId,
        date: new Date(input.date),
        time: input.time,
        reason: input.reason || "General consultation",
        status: "CONFIRMED",
      },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        doctor: { select: { name: true, imageUrl: true } },
      },
    });

    return transformAppointment(appointment);
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw new Error("Failed to book appointment. Please try again later.");
  }
}

// Update appointment status
export async function updateAppointmentStatus(input: {
  id: string;
  status: AppointmentStatus;
}) {
  try {
    const appointment = await prisma.appointment.update({
      where: { id: input.id },
      data: { status: input.status },
    });

    return appointment;
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw new Error("Failed to update appointment");
  }
}
