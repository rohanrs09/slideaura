import "./App.css";
import Header from "./components/custom/Header";
import Hero from "./components/custom/Hero";
import Features from "./components/custom/Features";
import Footer from "./components/custom/Footer";
import About from "./components/custom/About";

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <main className="pt-16">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}

// Export About component for routing
export { About };

export default App;
