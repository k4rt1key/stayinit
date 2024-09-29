export default function Loading({ size }) {
  if (size == "small") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-800"></div>
      </div>
    );
  }

  if (size == "medium") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-800"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className={
          "animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-800"
        }
      ></div>
    </div>
  );
}
