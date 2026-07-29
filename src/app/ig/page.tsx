import { redirect } from "next/navigation";

export default function InstagramBioRedirect() {
  redirect(
    "/instagram?utm_source=instagram&utm_medium=organic&utm_campaign=ig_2026_08_verticales&utm_content=IG26-AUG-01&interest=Transformaci%C3%B3n%20digital%20general#contacto",
  );
}
