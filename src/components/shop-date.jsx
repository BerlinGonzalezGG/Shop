"use client";

const formatDate = (date) => {
  const options = { month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const ShopDate = () => {
  const today = new Date();
  const formattedDate = formatDate(today);
  return (
    <h2 className="text-gray-400 text-lg tracking-widest font-semibold title-font">
      {formattedDate}
    </h2>
  );
};

export default ShopDate;
