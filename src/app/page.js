import Navbar from "./components/header/Navbar";

export default function Home() {
  return (
    <div className="min-h-full">
      <Navbar />
      <img
        className="h-81 w-full object-cover"
        src="/background1.jpeg"
        alt="Background"
      />
    </div>
  );
}
