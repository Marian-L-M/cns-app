import Image from "next/image";

interface InfoBoxProps {
  infoBox: InfoBoxItem[];
}

export default function InfoBox({ infoBox }: InfoBoxProps) {
  const images = infoBox.filter(
    (item) => item?.type === "image"
  ) as ImageType[];
  const collections = infoBox.filter(
    (item) => item?.type === "collection"
  ) as CollectionType[];
  const texts = infoBox.filter((item) => item?.type === "text") as TextType[];

  return (
    <div className="w-full flex flex-col gap-4" id="info-box">
      <div className="flex flex-col gap-4" id="image-container">
        {images.map((image) => (
          <div
            key={"image-" + image.id}
            className="gap-4 mb-4"
            id="image-container"
          >
            <Image
              key={"image-" + image.id}
              width={280}
              height={280}
              src={image.url}
              alt={image.title}
              className="w-full"
            />
            <h3 className="bg-gray-100 text-center mb-2">{image.title}</h3>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4" id="collection-container">
        {collections.map((collection) => (
          <dl key={"collection-" + collection.id}>
            <h3 className="bg-gray-100 text-center mb-2">{collection.title}</h3>
            {collection.bars.map((bar) => (
              <div key={"bar-" + bar.id} className="flex gap-1">
                <dt className="flex-1">{bar.key}</dt>
                <dd className="flex-1">{bar.value}</dd>
              </div>
            ))}
          </dl>
        ))}
      </div>
      <div className="flex flex-col gap-4" id="text-container">
        {texts.map((text) => (
          <div key={"text-" + text.id}>
            <h3 className="bg-gray-100 text-center mb-2">{text.title}</h3>
            <p>{text.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
