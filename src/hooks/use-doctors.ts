"use client";

import { getDoctors } from "@/lib/actions/doctor";
import { useQuery } from "@tanstack/react-query";

export function useGetDoctors() {
  const result = useQuery({
    queryKey: ["getDoctors"],
    queryFn: getDoctors,
  });

  return result;
}
