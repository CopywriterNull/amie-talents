"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

interface CalBookingProps {
  calLink?: string;
  className?: string;
}

export function CalBooking({
  calLink = "amietalents/intro-call",
  className,
}: CalBookingProps) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        styles: { branding: { brandColor: "#e07356" } }, // coral color
        hideEventTypeDetails: false,
      });
    })();
  }, []);

  return (
    <div className={className}>
      <Cal
        calLink={calLink}
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
}

// Inline popup version
export function CalBookingButton({
  calLink = "amietalents/intro-call",
  children,
  className,
}: {
  calLink?: string;
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        styles: { branding: { brandColor: "#e07356" } },
      });
    })();
  }, []);

  return (
    <button
      className={className}
      data-cal-link={calLink}
      data-cal-config='{"layout":"month_view"}'
    >
      {children}
    </button>
  );
}
