"use client";

import getInitials from "@/utils/get-initials";
import { createClient } from "@/utils/supabase/client";
import { Avatar } from "flowbite-react";
import { useEffect, useState } from "react";

export default function SupabaseAvatar({
  full_name,
  path,
}: {
  full_name: string | null;
  path: string | null;
}) {
  const [publicUrl, setPublicUrl] = useState<string>();
  const supabase = createClient();

  useEffect(() => {
    const getPublicUrl = async (p: string) => {
      const { data } = await supabase.storage.from("avatars").getPublicUrl(p, {
        transform: { width: 100, height: 100, resize: "fill", quality: 100 },
      });

      if (data) setPublicUrl(data.publicUrl);
    };

    if (path) getPublicUrl(path);
  }, [path, supabase.storage]);

  return (
    <Avatar
      alt="User settings"
      img={publicUrl}
      placeholderInitials={getInitials(full_name ?? "")}
      rounded
      size="sm"
    />
  );
}
