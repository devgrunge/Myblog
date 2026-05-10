import { NewspaperIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Container } from "./Container";

export const Header = () => {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-900">
            <NewspaperIcon className="h-6 w-6" />
            <span className="text-sm font-semibold tracking-wide">BLOG</span>
          </Link>
        </div>
      </Container>
    </header>
  );
};
