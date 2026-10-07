import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <main className="case-not-found">
      <p>Project district / No matching landmark</p>
      <h1>That project isn’t here.</h1>
      <p>Choose a project from the city to read its engineering story.</p>
      <Link href="/#projects">Return to selected work</Link>
    </main>
  );
}
