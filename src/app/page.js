import Navbar from "./components/header/Navbar";
import RoomCard from "./components/body/Room";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <img
        className="h-80 w-full object-cover"
        src="/background1.jpeg"
        alt="Background"
      />
      <div className="flex flex-1 justify-center items-center p-8">
          <RoomCard />
      </div>
    </div>
  );
}
