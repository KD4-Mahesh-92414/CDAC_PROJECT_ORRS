const DateFilterBar = () => {
  return (
    <div className="flex items-center gap-3 p-4 border-b">
      <button className="border px-3 py-1 rounded">Filter Train Result</button>
      <button className="border px-3 py-1 rounded">Filter</button>

      <button className="border px-3 py-1 rounded">22 Oct</button>
      <button className="border px-3 py-1 rounded bg-blue-100 border-blue-500">
        23 Oct
      </button>
      <button className="border px-3 py-1 rounded">24 Oct</button>
    </div>
  );
};

export default DateFilterBar;
