import telehealth from "../../assets/icons/Telehealth.svg";
import laboratoryIcon from "../../assets/icons/laboratoryIcon.svg";
import vaccinationIcon from "../../assets/icons/vaccination.svg";
import imagingIcon from "../../assets/icons/imagingicon.svg";
import healthRecordIcon from "../../assets/icons/healthRecordIcon.svg";
import pharmacyIcon from "../../assets/icons/pharmacyIcon.svg";
import { NavLink } from "react-router-dom";
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
      title: "Laboratory",
      icon: laboratoryIcon,
      color: "bg-[#FDEFE5] text-[#545F71]",
      disabled: false,
      link: "/health-records",
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
      id: 3,
      title: "Imaging",
      icon: imagingIcon,
      color: "bg-[#F1FCF0]",
      disabled: true,
      link: "",
    },
    {
      id: 4,
      title: "Home Health Records",
      icon: healthRecordIcon,
      color: "bg-[#D3E4D3]",
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
  return (
    <>
      <div className=" px-6 color-primary font-primary text-xl">
        Our services
        <div className="mt-4 flex grid lg:grid-cols-4 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl">
          {cards.map((card: ICard) => {
            return <Card card={card} />;
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
        className={`${card.color} h-[10rem] rounded-xl ${!card.disabled ? "cursor-pointer" : "text-gray-300"}`}
      >
        <div className="p-6">
          <img src={card.icon} alt={card.title} className="h-[2rem] w-[2rem]" />
        </div>
        <div className="px-6 nowrap">
          <span>
            {card.title}
            {card.disabled && (
              <span className="px-2  text-sm font-light">(coming soon)</span>
            )}
          </span>
        </div>
      </div>
    </NavLink>
  );
};
export default HomePage;
