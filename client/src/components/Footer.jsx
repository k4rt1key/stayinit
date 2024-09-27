import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full px-[4rem] py-4 bg-black text-white">
      <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12  text-center md:justify-between">
        <div className="text-center font-normal">&copy; Stayin'It</div>
      </div>
    </footer>
  );
}
