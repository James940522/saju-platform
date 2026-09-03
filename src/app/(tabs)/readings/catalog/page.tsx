import { permanentRedirect } from "next/navigation";
import { routes } from "@/shared/config";

export default function Page() {
  permanentRedirect(routes.readings);
}
