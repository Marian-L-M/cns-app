import dynamic from "next/dynamic";

const MapForm = dynamic(() => import("@/components/forms/MapForm"), {
  ssr: false,
});

const NewMap = () => {
  return <MapForm />;
};

export default NewMap;
