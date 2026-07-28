import { redirect } from "next/navigation";

export default function InstagramBioRedirect() {
  redirect(
    "/instagram?utm_source=instagram&utm_medium=organic&utm_campaign=bio&utm_content=profile_link",
  );
}
