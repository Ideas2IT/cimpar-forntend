const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div>
        <p className="font-primary text-2xl text-center">Unauthorized</p>
        <p className="font-secondary text-xl">
          You do not have access to this page.
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
