import Image from "next/image";

export default function Home() {
  return (
    <div id="top-content">
      <div id="title-element">
        <h1 className="text-2xl">Explore Kamolin</h1>
      </div>
      <div className="flex flex-wrap " id="content-group-1">
        <div className="w-3/4" id="world-map-element">
          {/* set width to container width */}
          <Image
            src={"/dashboard-map.png"}
            alt="world map"
            width={1000}
            height={1000}
            className="w-full"
          />
        </div>
        <div className="w-1/4" id="text-element">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
          officiis assumenda nobis placeat corporis aut quaerat quae provident
          possimus amet asperiores nisi inventore neque unde distinctio officia
          ea ex tenetur, architecto rerum omnis, esse iste? Neque, vel. Aliquid
          consequuntur, porro totam soluta commodi nemo quaerat nulla obcaecati
          alias expedita nihil doloremque unde magni excepturi possimus, quas
          molestias culpa distinctio! Non libero, minima rerum quod est quis
          eaque dolor architecto a nulla, voluptatem nobis molestias magni
          eligendi repellendus. Magnam explicabo consequatur quasi optio,
          repellendus quam eveniet ipsa saepe nemo quidem rerum alias, similique
          temporibus recusandae! Numquam error consectetur, cum, ullam nobis
          inventore nam similique eius odio iure aspernatur quod vero,
          distinctio consequatur sint sequi veniam eos debitis nulla architecto!
          Quaerat officiis dolore fuga laboriosam ut architecto facere, rem
          tempore ipsum beatae consequuntur ullam omnis quod cupiditate at et
          laborum sint temporibus perspiciatis molestias illo, dolorem, in amet
          sapiente! Cumque aspernatur sint error sed nostrum, tenetur iusto
          deleniti quae veritatis fugit iste sapiente nobis, voluptate corporis
          repudiandae esse asperiores reiciendis optio! Ducimus impedit quos rem
          enim totam aut ullam, voluptatem nam excepturi? Debitis ex ipsum
          deserunt fuga et inventore at eum aliquam culpa aliquid voluptatum
          placeat harum consectetur, recusandae magnam iusto repudiandae.
        </div>
      </div>
    </div>
  );
}
