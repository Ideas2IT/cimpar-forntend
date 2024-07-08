const PageNotFound = () => {
  return (
    <div className="flex flex h-full items-center justify-center">
      <span>
        <div className="text-2xl font-primary text-center">404 Not Found</div>
        <div className="text-xl font-secondary block">
          The page you are looking for does not exist.
        </div>
      </span>
    </div>
  );
};

export default PageNotFound;
