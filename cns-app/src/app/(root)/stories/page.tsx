import Link from "next/link";
import ReactMarkDown from "react-markdown";
import { Story, Status, AdminSettings } from "@prisma/client";
import prisma from "@/../prisma/db";

import StatusFilter from "@/components/filters/StatusFilter";
import Pagination from "@/components/ui/pagination";
import { buttonVariants } from "@/components/ui/button";

import DataTable from "./DataTable";
import { Tabs, TabsContent } from "@/components/ui/tabs";

export const metadata = {
  title: `Stories`,
};

// export interface SearchParams {
//   status: Status;
//   page: string;
//   orderBy: keyof Story;
// }

interface titleProps {
  mainTitle: AdminSettings;
  mainText: AdminSettings;
}

export default async function Stories() {
  const settings = await prisma.adminSettings.findMany({
    where: {
      category: "PAGE",
      subCategory: "story",
    },
    orderBy: {
      order: "asc",
    },
  });

  const storyId = settings.find((item) => item.type === "storyId");
  const mainTitle = settings.find((item) => item.type === "mainTitle");
  const mainText = settings.find((item) => item.type === "mainText");
  const contents = settings.filter(
    (item) => item.type === "subTitle" || item.type === "text"
  );

  console.log(settings);
  return (
    <div className="flex flex-col gap-20 w-full">
      <Tabs defaultValue="read" className="w-full">
        {/* <TabsList className="absolute top-0 left-0 -translate-y-full">
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
          <TabsTrigger value="revisions">Revisions</TabsTrigger>
        </TabsList> */}
        <TabsContent className="flex flex-col gap-8" value="read">
          {!storyId ? (
            <div
              id="top-content"
              className="w-full flex flex-col gap-4 max-w-screen-2xl mx-auto relative"
            >
              {(mainTitle || mainText) && (
                <TitleSection mainTitle={mainTitle} mainText={mainText} />
              )}
              <div
                id="content-container"
                className=" border border-slate-100 rounded-md p-2"
              >
                <ContentList contents={contents} />
              </div>
            </div>
          ) : (
            <div
              id="top-content"
              className="w-ful grid grid-cols-6 gap-4 max-w-screen-2xl mx-auto relative"
            >
              {(mainTitle || mainText) && (
                <TitleSection mainTitle={mainTitle} mainText={mainText} />
              )}
              {/* Story display module */}

              <div
                id="content-container"
                className="col-span-2 row-span-2  border border-slate-100 rounded-md py-2 px-4"
              >
                <ContentList contents={contents} />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// export default async function Stories({
//   searchParams: rawSearchParams,
// }: {
//   searchParams: SearchParams;
// }) {
//   // Create a fully resolved object rather than the promise that contains it.
//   const searchParams = await Promise.resolve(rawSearchParams);

//   const pageSize = 2;
//   const page = searchParams.page ? parseInt(searchParams.page) : 1;
//   const orderBy = searchParams.orderBy ? searchParams.orderBy : "createdAt";
//   const statuses = Object.values(Status);

//   const status = statuses.includes(searchParams.status)
//     ? searchParams.status
//     : undefined;

//   let where = {};

//   if (status) {
//     where = {
//       status,
//     };
//   } else {
//     where = {
//       NOT: [{ status: "COMPLETED" as Status }],
//     };
//   }
//   const itemCount = await prisma.story.count({ where });
//   const stories = await prisma.story.findMany({
//     where,
//     orderBy: {
//       [orderBy]: "desc",
//     },
//     take: pageSize,
//     skip: (page - 1) * pageSize,
//   });

//   return (
//     <div className="w-full h-full bg-white">
//       <div className="flex gap-2">
//         <StatusFilter />
//       </div>
//       <DataTable stories={stories} searchParams={searchParams} />
//       <Pagination
//         itemCount={itemCount}
//         pageSize={pageSize}
//         currentPage={page}
//       />
//     </div>
//   );
// }

function ContentList({ contents }: { contents: AdminSettings[] }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {contents.map((content, index) => (
        <div key={`content-${content.type}-${content.order}-${index}`}>
          {content.type === "subTitle" && (
            <h3 className="text-lg font-semibold">{content.value}</h3>
          )}
          {content.type === "text" && (
            <ReactMarkDown className={"prose dark:prose-invert text-sm"}>
              {content.value}
            </ReactMarkDown>
          )}
        </div>
      ))}
    </div>
  );
}

function TitleSection({ mainTitle, mainText }: titleProps) {
  return (
    <div className="col-span-6  flex flex-col gap-2">
      {mainTitle && <h1 className="text-2xl ">{mainTitle.value}</h1>}
      {mainText && (
        <div className="w-full">
          <ReactMarkDown className={"prose dark:prose-invert text-sm"}>
            {mainText.value}
          </ReactMarkDown>
        </div>
      )}
    </div>
  );
}
