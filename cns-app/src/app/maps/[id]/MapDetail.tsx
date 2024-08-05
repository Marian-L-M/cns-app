import { Map } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatTime } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import ReactMarkDown from "react-markdown";
import DeleteButton from "@/components/buttons/DeleteButton";

import MapModule from "@/components/maps/MapModule";

interface Props {
  map: Map;
}

const MapDetail = async ({ map }: Props) => {
  return (
    <div className="map-wrapper">
      <MapModule map={map} />
    </div>
  );
};

export default MapDetail;
