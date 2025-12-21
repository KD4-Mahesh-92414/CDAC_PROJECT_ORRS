import { Login } from "./components/Login";
import SelectSeatsPage from "./Vineet/selectseatcomponents/SelectSeatsPage";
import Register from "./components/Register";
import JourneyReviewPage from "./Abhishekh/Components/JourneyReviewPage";
import BookingPage from "./pratik/BookingPage";
import TrainResultPage from "./pratik1/TrainResultPage";
import TrainSearchPage from "./pratik2/TrainSearchPage";

function App() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* <Login></Login>
      <Register></Register> */}
      <SelectSeatsPage></SelectSeatsPage>
      {/* <JourneyReviewPage></JourneyReviewPage> */}
      {/* <BookingPage></BookingPage> */}
      {/* <TrainResultPage> </TrainResultPage> */}
      {/* <TrainSearchPage></TrainSearchPage> */}
    </div>
  );
}

export default App;
