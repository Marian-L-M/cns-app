import MastermapDisplayModule from "@/components/displays/MastermapDisplayModule";
import { fetchMasterMap } from "@/lib/fetchMapData";
import CursorContextProvider from "@/store/cursorContext";

export default async function Home() {
  const masterMap = await fetchMasterMap(6);

  if (!masterMap) {
    return <div className="text-destructive">No maps found</div>;
  }

  return (
    <div
      id="top-content"
      className="w-ful grid grid-cols-6 gap-4 max-w-screen-2xl mx-auto relative"
    >
      <h1 className="text-2xl col-span-4 ">Discover Kamolin!</h1>
      <CursorContextProvider>
        <MastermapDisplayModule masterMap={masterMap} />
      </CursorContextProvider>
      <div
        id="info-container"
        className="col-span-2 row-span-2 flex flex-col gap-1"
      >
        <h2 className="text-xl">This is the intro text!</h2>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae ab
          molestias excepturi quae possimus soluta consequatur labore unde?
          Repudiandae magni itaque non, delectus sapiente perferendis minus
          reprehenderit aut, optio nemo obcaecati voluptas aliquam eos ea nobis
          consectetur maiores in ullam natus blanditiis, placeat repellat atque
          odit iure. Odit blanditiis ratione dolore suscipit veritatis
          perspiciatis delectus qui debitis tempore, deleniti unde repellat
          amet, dolorem minus, nulla non earum error! Qui laboriosam voluptates
          minima dignissimos, officia debitis consequatur vitae possimus quod
          eius! Inventore odit, dignissimos odio omnis tempora fuga, nisi esse
          doloribus alias similique molestias obcaecati modi. Architecto itaque
          cum unde sapiente dolorem ad magni provident necessitatibus corporis,
          ducimus ipsam repellat expedita, autem, alias odit mollitia tempora
          perferendis incidunt quis! Deleniti, commodi! Voluptatum magnam maxime
          ipsa eius unde eos alias ad odio mollitia numquam, quasi ipsam
          necessitatibus. Aperiam dolorem incidunt nesciunt expedita repellendus
          tempore tenetur voluptate quisquam dicta nemo. Dignissimos dolore
          mollitia velit aspernatur. Nihil, suscipit? Nisi, nostrum incidunt,
          ipsa facilis vitae ducimus veritatis autem, odit voluptatem expedita
          repellat! Repellendus tenetur accusantium commodi aliquam deleniti
          enim, doloribus libero voluptatum tempora ea saepe ipsam optio quam
          laboriosam expedita quisquam hic ratione facere similique possimus
          odio. Harum, modi! Natus sequi tempore sit nulla itaque?
        </p>
      </div>
    </div>
  );
}
