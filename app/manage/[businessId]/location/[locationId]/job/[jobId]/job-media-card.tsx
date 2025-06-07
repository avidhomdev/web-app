import { Tables } from "@/types/supabase";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { Card } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import EditMediaDrawer from "./edit-media-drawer";
import UploadMediaDrawer from "./upload-media-drawer";
import DeleteMediaModal from "./delete-media-modal";

async function MediaList({
  media,
  mediaPaths,
}: {
  media: Tables<"business_location_job_media">[];
  mediaPaths: string[];
}) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.storage
    .from("business")
    .createSignedUrls(mediaPaths, 3600);

  if (error) throw error;

  const signedUrlDictionary = data.reduce<{ [k: string]: (typeof data)[0] }>(
    (dictionary, signedUrl) => {
      if (!signedUrl.path) return dictionary;

      dictionary[signedUrl.path] = signedUrl;

      return dictionary;
    },
    {},
  );

  return media.map((item) => {
    const signedUrl = signedUrlDictionary[item.path];

    return (
      <figure
        key={item.id}
        className="group/figure relative w-36 overflow-hidden rounded-sm bg-gray-100 p-2 pb-0 dark:bg-gray-700"
      >
        <div className="absolute top-2 right-2 z-10 hidden items-center gap-1 group-hover/figure:flex">
          <EditMediaDrawer media={item} />
          <DeleteMediaModal id={item.id} />
        </div>
        {signedUrl && (
          <Link target="blank" href={signedUrl.signedUrl}>
            <div className="relative mx-auto size-32">
              <Image
                src={signedUrl.signedUrl}
                alt={item.name}
                fill
                sizes="10rem"
              />
            </div>
          </Link>
        )}

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
  const mediaPaths = media.map((m) => m.path);

  return (
    <Card className="group">
      <div className="flex items-center justify-between gap-2">
        <h6 className="text-lg font-semibold tracking-tighter">Media</h6>
        <UploadMediaDrawer />
      </div>
      <div className="flex flex-wrap gap-2">
        {mediaPaths.length ? (
          <MediaList media={media} mediaPaths={mediaPaths} />
        ) : (
          "No media found."
        )}
      </div>
    </Card>
  );
}
