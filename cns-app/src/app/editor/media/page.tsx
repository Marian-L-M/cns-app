import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function mediaPage() {
  return (
    <div className="flex flex-col gap-20 w-full">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="absolute top-0 left-0 -translate-y-full">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="revisions">Revisions</TabsTrigger>
        </TabsList>
        <TabsContent className="flex flex-col gap-8" value="upload">
          <div className="w-full grid grid-cols-8 gap-4 mx-auto relative">
            <div className="col-span-8">
              <h1>Media Upload</h1>
            </div>
          </div>
        </TabsContent>
        <TabsContent className="flex flex-col gap-8" value="library">
          <div className="w-full grid grid-cols-8 gap-4 mx-auto relative">
            <div className="col-span-8">
              <h1>Media Library</h1>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default mediaPage;
