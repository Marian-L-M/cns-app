import MastermapDisplayModule from "@/components/displays/MastermapDisplayModule";
import { fetchMasterMap } from "@/lib/fetchMapData";
import CursorContextProvider from "@/store/cursorContext";
import prisma from "@/../prisma/db";
import ReactMarkDown from "react-markdown";
import { AdminSettings } from "@prisma/client";

export default async function Home() {
  const settings = await prisma.adminSettings.findMany({
    where: {
      category: "PAGE",
      subCategory: "top",
    },
    orderBy: {
      order: "asc",
    },
  });

  // Take first mastermapid and main title
  const masterMapId = settings.find((item) => item.type === "mastermapId");
  const mainTitle = settings.find((item) => item.type === "mainTitle");
  const contents = settings.filter(
    (item) => item.type === "subTitle" || item.type === "text"
  );

  if (!masterMapId) {
    // Text only mode
    return (
      <div
        id="top-content"
        className="w-full flex flex-col gap-4 max-w-screen-2xl mx-auto relative"
      >
        {mainTitle && (
          <h1 className="text-2xl col-span-4 ">{mainTitle.value}</h1>
        )}
        <div
          id="content-container"
          className=" border border-slate-100 rounded-md p-2"
        >
          <ContentList contents={contents} />
        </div>
      </div>
    );
  } else {
    // Mastermap mode
    const masterMap = await fetchMasterMap(parseInt(masterMapId.value));
    return (
      <div
        id="top-content"
        className="w-ful grid grid-cols-6 gap-4 max-w-screen-2xl mx-auto relative"
      >
        {mainTitle && (
          <h1 className="text-2xl col-span-4 ">{mainTitle.value}</h1>
        )}
        {masterMap && (
          <CursorContextProvider>
            <MastermapDisplayModule masterMap={masterMap} />
          </CursorContextProvider>
        )}
        <div
          id="content-container"
          className="col-span-2 row-span-2  border border-slate-100 rounded-md p-2"
        >
          <ContentList contents={contents} />
        </div>
      </div>
    );
  }
}

function ContentList({ contents }: { contents: AdminSettings[] }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {contents.map((content, index) => (
        <div key={`content-${content.type}-${content.order}-${index}`}>
          {content.type === "subTitle" && <h3>{content.value}</h3>}
          {content.type === "text" && (
            <ReactMarkDown className={"prose dark:prose-invert"}>
              {content.value}
            </ReactMarkDown>
          )}
        </div>
      ))}
    </div>
  );
}
