import { Container } from "./Container";

export const Footer = () => {
  return (
    <footer className="mt-16 border-t border-zinc-200 bg-white">
      <Container>
        <div className="py-8 text-sm text-zinc-500">© {new Date().getFullYear()} Blog</div>
      </Container>
    </footer>
  );
};
