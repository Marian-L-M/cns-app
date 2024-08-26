import dynamic from "next/dynamic";

const WikiForm = dynamic(() => import("@/components/forms/WikiForm"), {
  ssr: false,
});

const NewWiki = () => {
  return <WikiForm />;
};

export default NewWiki;
