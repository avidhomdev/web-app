import { createSupabaseServerClient } from "@/utils/supabase/server";
import Image from "next/image";

type TUseSupabaseSignedImage = {
  className?: string;
  path: string;
  cacheInSeconds?: number;
  options?: {
    transform?: {
      width: number;
      height: number;
    };
  };
};

async function SupabaseSignedImage({
  className,
  path,
  cacheInSeconds = 86400,
  options,
}: TUseSupabaseSignedImage) {
  const supabase = await createSupabaseServerClient();
  const uri = await supabase.storage
    .from("businesses")
    .createSignedUrl(path, cacheInSeconds, options)
    .then(({ data }) => data?.signedUrl);

  return (
    uri && (
      <Image
        src={uri}
        alt={path}
        key={path}
        className={className}
        fill
        sizes="100%"
      />
    )
  );
}

export default SupabaseSignedImage;
