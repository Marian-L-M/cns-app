import Image from "next/image";

interface InfoBoxProps {
  infoBox: InfoBoxItem[];
}

const InfoBox = ({ infoBox }: InfoBoxProps) => {
  const images = infoBox.filter(
    (item) => item?.type === "image"
  ) as ImageType[];
  const collections = infoBox.filter(
    (item) => item?.type === "collection"
  ) as CollectionType[];

  //   useEffect(() => {

  //     function createInfoBoxBars() {
  //       const infoBox = document.getElementById("info-box");
  //       result.forEach((collection) => {
  //         const collectionHeader = document.createElement("h3");
  //         const headerContent = document.createTextNode(collection.title);
  //         collectionHeader.appendChild(headerContent);
  //         infoBox?.appendChild(collectionHeader);
  //       });
  //     }
  //     createInfoBoxBars();
  //   }, []);

  return (
    <div className="col-span-1" id="info-box">
      <h2>Infobox</h2>
      <div id="image-container">
        {/* 240828 To do: Get proper samples images to prevent  Next from breaking */}
        {/* {images.map((image) => (
          <Image
            key={"image-" + image.id}
            width={240}
            height={240}
            src={image.url}
            alt={image.title}
          />
        ))} */}
      </div>
      {collections.map((collection) => (
        <dl key={"collection-" + collection.id}>
          <h3 className="bg-slate-200">{collection.title}</h3>
          {collection.bars.map((bar) => (
            <div key={"bar-" + bar.id} className="flex gap-1 ">
              <dt>{bar.key}</dt>
              <dd>{bar.content}</dd>
            </div>
          ))}
        </dl>
      ))}
    </div>
  );
};

export default InfoBox;
