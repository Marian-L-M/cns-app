// import useSWR from "swr";
// import { useEffect, useState } from "react";
// // import prisma from "../../../../prisma/db";

// interface InfoBoxContentsProps {
//   id: number;
// }
// // 240815 Fetching from prisma does not work on client side
// // Create API route and fetch via SWR
// // https://nextjs.org/docs/pages/building-your-application/data-fetching/client-side

// const InfoBoxContents = async ({ id }: InfoBoxContentsProps) => {
//   //   const fetcher = (...args) => fetch(...args).then((res) => res.json());
//   //   const { data, error } = useSWR("/api/profile-data", fetcher);
//   const { data, error } = useSWR(
//     "",
//     (url) => fetch(url).then((res) => res.json())
//   );

//   if (error) return <div>Failed to load</div>;

//   if (!data) return <div>Loading...</div>;

//   return (
//     <div>
//       <p>Infobox working</p>
//       {/* <h4>{area.name}</h4>
//       <p>{area.description}</p> */}
//     </div>
//   );
// };

// export default InfoBoxContents;
