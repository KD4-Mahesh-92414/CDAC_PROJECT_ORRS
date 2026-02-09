import { useDispatch } from "react-redux";
import { setSearchData } from "../../store/slices/bookingSlice";
import TrainSearchForm from "../common/TrainSearchForm";

export default function HeaderSearchBar({ searchData }) {
  const dispatch = useDispatch();

  const handleSearch = (data) => {
    dispatch(setSearchData(data));
  };

  return (
    <div className="flex items-center justify-center px-4 py-2">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-2 max-w-4xl w-full">
        <TrainSearchForm
          initialFrom={searchData?.from || ""}
          initialTo={searchData?.to || ""}
          initialDate={searchData?.date || ""}
          onSearch={handleSearch}
          variant="compact"
        />
      </div>
    </div>
  );
}