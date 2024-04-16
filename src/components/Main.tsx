import Header from "./Header";
import LabTestResults from "./LabTestResults";

const Main = () => {
  return (
    <div className="flex flex-col flex-grow bg-gray-100 p-8">
      <Header />
      <LabTestResults />
    </div>
  );
};

export default Main;
