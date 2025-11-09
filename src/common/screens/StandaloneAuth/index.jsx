import { useEffect } from "react";
import { useParams } from "react-router";
import { Layout } from "@/common/layout/layout";
import { useAuthContext } from "@/common/context";
import { decodeUrlParam } from "@/common/utils";
import Screens from "@/common/screens";

export default function StandaloneAuthPage() {
  const { id, url } = useParams();

  const { setProjectId, setBackendUrl } = useAuthContext();

  useEffect(() => {
    const decodedUrl = decodeUrlParam(url);

    setProjectId(id);
    setBackendUrl(decodedUrl);
  }, [id, url, setProjectId, setBackendUrl]);

  return (
    <Layout>
      <Screens />
    </Layout>
  );
}
