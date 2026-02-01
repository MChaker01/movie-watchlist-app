const Spinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border border-white/10"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-400 animate-spin"></div>
      </div>
    </div>
  );
};

export default Spinner;
