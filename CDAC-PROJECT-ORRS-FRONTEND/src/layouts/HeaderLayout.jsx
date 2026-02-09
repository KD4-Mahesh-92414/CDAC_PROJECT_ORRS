import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import BookingNavbar from "../components/layout/BookingNavbar";
import HeaderSearchBar from "../components/layout/HeaderSearchBar";
import JourneySteps from "../components/booking/JourneySteps";
import { setSearchData } from "../store/slices/bookingSlice";

export default function HeaderLayout() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { searchData } = useSelector((state) => state.booking);

  const hideSearchBar = ["/login", "/register", "/confirmation", "/"].includes(
    location.pathname
  );
  const hideJourneySteps = [
    "/login",
    "/register",
    "/confirmation",
    "/",
  ].includes(location.pathname);

  const getCurrentStep = () => {
    const path = location.pathname;
    if (path.includes("/trains")) return 1;
    if (path.includes("/seats")) return 2;
    if (path.includes("/passengers")) return 3;
    if (
      path.includes("/review") ||
      path.includes("/payment") ||
      path.includes("/confirmation")
    )
      return 4;
    return 1;
  };

  return (
    <div className="w-full bg-gradient-to-r from-violet-600 to-violet-700 shadow-lg">
      <BookingNavbar />
      {!hideSearchBar && (
        <div className="border-t border-white/20">
          <HeaderSearchBar searchData={searchData} />
        </div>
      )}
      {!hideJourneySteps && (
        <div className="border-t border-white/20 bg-white">
          <JourneySteps currentStep={getCurrentStep()} />
        </div>
      )}
    </div>
  );
}
