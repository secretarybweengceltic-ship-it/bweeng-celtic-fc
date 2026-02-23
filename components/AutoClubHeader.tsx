"use client";

import { usePathname } from "next/navigation";
import ClubHeader from "./ClubHeader";

export default function AutoClubHeader() {
  const pathname = usePathname();

  let title = "Bweeng Celtic FC";
  let subtitle = "";

  if (pathname === "/") {
    title = "Home";
    subtitle = "Welcome to the official website of Bweeng Celtic FC";
  }
  else if (pathname.startsWith("/committee")) title = "Club Committee";
  else if (pathname.startsWith("/about")) title = "About";
  else if (pathname.startsWith("/club-history")) title = "Club History";
  else if (pathname.startsWith("/fixtures")) title = "Fixtures";
  else if (pathname.startsWith("/gallery")) title = "Gallery";
  else if (pathname.startsWith("/announcements")) title = "News";

  return <ClubHeader title={title} subtitle={subtitle} />;
}
