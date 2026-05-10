import { HomePage } from "./pages/HomePage";
import { useUIStore } from "./stores/uiStore";

const App = () => {
  const theme = useUIStore((state) => state.theme);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  return (
    <div data-theme={theme}>
      <button onClick={toggleSidebar} type="button">{sidebarOpen ? "Fechar" : "Abrir"} menu</button>
      <HomePage />
    </div>
  );
};

export default App;
