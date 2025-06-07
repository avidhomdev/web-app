import SupabaseSignedImage from "@/components/supabase-signed-image";
import { Tables } from "@/types/supabase";
import { Card } from "flowbite-react";
import DeleteMediaModal from "./delete-media-modal";
import EditMediaDrawer from "./edit-media-drawer";
import UploadMediaDrawer from "./upload-media-drawer";

async function MediaList({
  media,
}: {
  media: Tables<"business_location_job_media">[];
}) {
  return media.flatMap((item) => {
    return (
      <figure
        key={item.id}
        className="group/figure relative aspect-square w-36 overflow-hidden rounded-sm bg-gray-100 p-2 pb-0 dark:bg-gray-700"
      >
        <div className="absolute top-2 right-2 z-10 hidden items-center gap-1 group-hover/figure:flex">
          <EditMediaDrawer media={item} />
          <DeleteMediaModal id={item.id} />
        </div>
        <SupabaseSignedImage
          className="size-32"
          path={item.path}
          options={{ transform: { width: 200, height: 200 } }}
        />
        <figcaption className="p-2 text-center text-xs">{item.name}</figcaption>
      </figure>
    );
  });
}

export default async function JobMediaCard({
  media,
}: {
  media: Tables<"business_location_job_media">[];
}) {
  return (
    <Card className="group">
      <div className="flex items-center justify-between gap-2">
        <h6 className="text-lg font-semibold tracking-tighter">Media</h6>
        <UploadMediaDrawer />
      </div>
      <div className="flex flex-wrap gap-2">
        {media.length ? <MediaList media={media} /> : "No media found."}
      </div>
    </Card>
  );
}
