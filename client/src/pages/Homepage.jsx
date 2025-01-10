import NavBar from "../components/navbar/Navbar";
import landingImg from "../assets/images/pexels-matthiaszomer-422218.jpg";

const Homepage = () => {
  return (
    <>
      <NavBar />
      <div className="relative w-full h-[calc(100vh-4rem)]">
        <img
          src={landingImg}
          alt=""
          className="absolute w-full h-full object-cover z-10"
        />

        {/* Content Section */}
        <div className="absolute shadow-lg text-white top-16 md:ml-10 m-3 z-20 bg-opacity-70 md:p-8 p-4 rounded-lg backdrop-blur-sm bg-transparent">
          <h1 className="text-primary md:text-7xl text-5xl font-extrabold mt-4 tracking-wide drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
            Slaughter
          </h1>

          <h2 className="text-secondary font-extrabold md:text-5xl text-2xl mt-4 tracking-wide drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
            Management System
          </h2>
          <p className="mt-4 text-lg text-gray-200 max-w-lg drop-shadow-sm">
            Streamline livestock tracking and record-keeping with accuracy and
            ease.
          </p>
        </div>
      </div>
    </>
  );
};

export default Homepage;
