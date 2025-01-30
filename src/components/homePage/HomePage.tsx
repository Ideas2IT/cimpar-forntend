import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import telehealth from "../../assets/icons/Telehealth.svg";
import healthRecordIcon from "../../assets/icons/healthRecordIcon.svg";
import imagingIcon from "../../assets/icons/imagingicon.svg";
import laboratoryIcon from "../../assets/icons/laboratoryIcon.svg";
import pharmacyIcon from "../../assets/icons/pharmacyIcon.svg";
import car from "../../assets/icons/transportationIcon.svg";
import vaccinationIcon from "../../assets/icons/vaccination.svg";
import { selectServiceTitle } from "../../store/slices/loginSlice";
import { PATH_NAME } from "../../utils/AppConstants";

interface ICard {
  id: number;
  title: string;
  icon: string;
  color: string;
  disabled: boolean;
  link: string;
}
const HomePage = () => {
  const cards: ICard[] = [
    {
      id: 1,
      title: "Clinical Laboratory",
      icon: laboratoryIcon,
      color: "bg-[#FDEFE5] text-[#545F71]",
      disabled: false,
      link: `${PATH_NAME.CREATE_APPOINTMENT}/laboratory`,
    },
    {
      id: 4,
      title: "Home Care",
      icon: healthRecordIcon,
      color: "bg-[#D3E4D3]",
      disabled: false,
      link: `${PATH_NAME.CREATE_APPOINTMENT}/home-care`,
    },
    {
      id: 3,
      title: "Imaging",
      icon: imagingIcon,
      color: "bg-[#F1FCF0]",
      disabled: false,
      link: `${PATH_NAME.CREATE_APPOINTMENT}/imaging`,
    },
    {
      id: 7,
      title: "Transportation",
      icon: car,
      color: "bg-[#D3E5FF]",
      disabled: false,
      link: "transportation",
    },
    {
      id: 2,
      title: "Vaccination",
      icon: vaccinationIcon,
      color: "bg-[#E7F5F9]",
      disabled: true,
      link: "",
    },
    {
      id: 5,
      title: "Pharmacy",
      icon: pharmacyIcon,
      color: "bg-[#EAECFB]",
      disabled: true,
      link: "",
    },
    {
      id: 6,
      title: "Telehealth",
      icon: telehealth,
      color: "bg-[#E7E7E7]",
      disabled: true,
      link: "",
    },
  ];
  const title = useSelector(selectServiceTitle);
  return (
    <>
      <div className="px-6 color-primary font-primary text-xl">
        {title}
        <div className="mt-4 flex grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl max-h-[calc(100vh-175px)] overflow-auto">
          {cards.map((card: ICard) => {
            return <Card card={card} key={card.id} />;
          })}
        </div>
      </div>
      <div className="flex flex-row bg-white"></div>
    </>
  );
};
const Card = ({ card }: { card: ICard }) => {
  return (
    <NavLink to={!card.disabled ? card.link : ""}>
      <div
        className={`${card.color} md:h-[10rem] h-[5rem] flex md:flex-col rounded-xl md:justify-evenly justify-start gap-3 p-3 ${!card.disabled ? "cursor-pointer" : "cursor-not-allowed"}`}
      >
        <img src={card.icon} alt={card.title} className="h-[2rem] w-[2rem]" />
        <div className={`${card.disabled && "text-gray-300"}`}>
          <span>{card.title}</span>
          {card.disabled && (
            <span className="px-2 text-xl font-light">(Coming Soon)</span>
          )}
        </div>
      </div>
    </NavLink>
  );
};
export default HomePage;
