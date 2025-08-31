import { Link } from "react-router-dom";
import { projects } from "../data/projects";

export default function Home() {
  return (
    <div className="grid gap-4">
      {Object.entries(projects).map(([id, project]) => (
        <Link
          key={id}
          to={`/project/${id}`}
          className="p-4 bg-blue-100 rounded-lg shadow hover:bg-blue-200 transition"
        >
          {project.name}
        </Link>
      ))}
    </div>
  );
}
