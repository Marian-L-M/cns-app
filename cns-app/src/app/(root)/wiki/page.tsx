import prisma from "@/../prisma/db";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import WikiCardContainer from "@/components/wiki/WikiCardContainer";
import { AdminSettings } from "@prisma/client";
import ReactMarkDown from "react-markdown";

export default async function Wiki() {
  const settings = await prisma.adminSettings.findMany({
    where: {
      category: "PAGE",
      subCategory: "wiki",
    },
    orderBy: {
      order: "asc",
    },
  });

  // Configuration types
  const contentTypes = ["text", "mainText", "mainTitle", "subTitle"];

  // Group content items by order number
  const groupedContent = settings
    .filter((item) => contentTypes.includes(item.type))
    .reduce((acc, item) => {
      if (!acc[item.order]) {
        acc[item.order] = [];
      }
      acc[item.order].push(item);
      return acc;
    }, {} as Record<number, AdminSettings[]>);

  // Configuration items
  // First block
  const mainTextGroup = groupedContent["1"] || [];
  const mainTitle = mainTextGroup.find((item) => item.type === "mainTitle");
  const mainText = mainTextGroup.find((item) => item.type === "mainText");
  const mainSubTitle = mainTextGroup.find((item) => item.type === "subTitle");
  const mainOtherText = mainTextGroup.find((item) => item.type === "text");

  // Free text blocks
  const otherTextGroups = Object.fromEntries(
    Object.entries(groupedContent).filter(([key, value]) => key !== "1")
  );

  const newWiki = settings.find((item) => item.type === "setNewWikis");
  const featuredWiki = settings.find(
    (item) => item.type === "setFeaturedWikis"
  );
  const exploreWiki = settings.find((item) => item.type === "setExploreWikis");

  return (
    <div className="flex flex-col gap-2 w-full">
      <Breadcrumb>
        <BreadcrumbList className="text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Wikis</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Tabs defaultValue="read" className="w-full">
        {/* <TabsList className="absolute top-0 left-0 -translate-y-full">
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
          <TabsTrigger value="revisions">Revisions</TabsTrigger>
        </TabsList> */}
        <TabsContent className="flex flex-col gap-8" value="read">
          <div className="w-full flex flex-row gap-4">
            {/* Contents Container */}
            <div className="flex-[3] p-2 border rounded-md border-slate-200 flex flex-wrap gap-4">
              {/* Title */}
              {mainTextGroup && (
                <div
                  className="w-full flex p-4 flex-col gap-2 border border-slate-200 rounded-md"
                  id="title-container"
                >
                  {mainTitle && (
                    <h1 className="w-full text-2xl font-bold ">
                      {mainTitle.value}
                    </h1>
                  )}
                  {mainText && <p className="text-md">{mainText.value}</p>}
                  {(mainSubTitle || mainOtherText) && (
                    <div className="w-full flex flex-col gap-2">
                      {mainSubTitle && (
                        <h3 className="text-xl font-semibold  bg-slate-100 px-2 py-1">
                          {mainSubTitle.value}
                        </h3>
                      )}
                      {mainOtherText && (
                        <ReactMarkDown
                          className={"prose dark:prose-invert text-md"}
                        >
                          {mainOtherText.value}
                        </ReactMarkDown>
                      )}
                    </div>
                  )}
                </div>
              )}
              {/* Contents */}
              {/* To do order with css */}
              <div className="w-full grid grid-cols-3 gap-4">
                {newWiki && (
                  <div className={`w-full`} style={{ order: newWiki?.order }}>
                    {/* New Wiki Section */}
                    <WikiCardContainer
                      type={newWiki.type}
                      amount={parseInt(newWiki.value)}
                    />
                  </div>
                )}
                {/* Featured Wiki Section */}
                {featuredWiki && (
                  <div
                    className={`w-full`}
                    style={{ order: featuredWiki.order }}
                  >
                    <WikiCardContainer
                      type={featuredWiki.type}
                      amount={parseInt(featuredWiki.value)}
                    />
                  </div>
                )}
                {/* Render grouped content sections */}
                {Object.keys(groupedContent)
                  .filter((orderNumber) => orderNumber !== "1") // Skip the main text group as it's rendered above
                  .sort((a, b) => parseInt(a) - parseInt(b))
                  .map((orderNumber) => {
                    const group = groupedContent[parseInt(orderNumber)];
                    const groupMainTitle = group.find(
                      (item) => item.type === "mainTitle"
                    );
                    const groupMainText = group.find(
                      (item) => item.type === "mainText"
                    );
                    const groupSubTitle = group.find(
                      (item) => item.type === "subTitle"
                    );
                    const groupOtherText = group.find(
                      (item) => item.type === "text"
                    );

                    return (
                      <div
                        key={orderNumber}
                        className="w-full flex flex-col gap-4 p-4 border border-gray-200 rounded-xl self-stretch"
                        style={{ order: parseInt(orderNumber) }}
                      >
                        {groupMainTitle && renderContentItem(groupMainTitle)}
                        {groupSubTitle && renderContentItem(groupSubTitle)}
                        {groupMainText && renderContentItem(groupMainText)}
                        {groupOtherText && renderContentItem(groupOtherText)}
                      </div>
                    );
                  })}
              </div>
            </div>
            {/* Explore/random wikis */}
            {exploreWiki && (
              <div className="flex-1 ">
                <WikiCardContainer
                  type={exploreWiki.type}
                  amount={parseInt(exploreWiki.value)}
                />
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="discussion">Discuss contents</TabsContent>
        <TabsContent value="revisions">Revisions</TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to render content based on type
function renderContentItem(item: AdminSettings) {
  switch (item.type) {
    case "mainTitle":
      return (
        <h2 key={item.id} className="text-2xl font-bold">
          {item.value}
        </h2>
      );
    case "subTitle":
      return (
        <h3
          key={item.id}
          className="text-xl font-semibold bg-slate-100 px-2 py-1"
        >
          {item.value}
        </h3>
      );
    case "mainText":
    case "text":
      return (
        <ReactMarkDown
          key={item.id}
          className="prose dark:prose-invert text-md"
        >
          {item.value}
        </ReactMarkDown>
      );
    default:
      return null;
  }
}
