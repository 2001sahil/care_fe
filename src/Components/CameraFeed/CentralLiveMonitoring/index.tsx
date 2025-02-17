import { useState } from "react";
import Loading from "../../Common/Loading";
import Page from "../../Common/components/Page";
import useQuery from "../../../Utils/request/useQuery";
import routes from "../../../Redux/api";
import LocationFeedTile from "../CameraFeedWithBedPresets";
import Fullscreen from "../../../CAREUI/misc/Fullscreen";
import useBreakpoints from "../../../Common/hooks/useBreakpoints";
import { useQueryParams } from "raviger";
import LiveMonitoringFilters from "./LiveMonitoringFilters";

export default function CentralLiveMonitoring(props: { facilityId: string }) {
  const [isFullscreen, setFullscreen] = useState(false);
  const limit = useBreakpoints({ default: 4, "3xl": 9 });

  const [qParams] = useQueryParams();

  const facilityQuery = useQuery(routes.getPermittedFacility, {
    pathParams: { id: props.facilityId },
  });

  const { data, loading } = useQuery(routes.listAssets, {
    query: {
      ...qParams,
      limit,
      offset: (qParams.page ? qParams.page - 1 : 0) * limit,
      asset_class: "ONVIF",
      facility: props.facilityId,
      location: qParams.location,
      in_use_by_consultation: qParams.in_use_by_consultation,
    },
  });

  const totalCount = data?.count ?? 0;

  return (
    <Page
      title="Live Monitoring"
      collapseSidebar
      backUrl={`/facility/${props.facilityId}/`}
      noImplicitPadding
      breadcrumbs={false}
      options={
        <LiveMonitoringFilters
          perPageLimit={limit}
          isFullscreen={isFullscreen}
          setFullscreen={setFullscreen}
          totalCount={totalCount}
        />
      }
    >
      {loading ||
      data === undefined ||
      facilityQuery.data === undefined ||
      facilityQuery.loading ? (
        <Loading />
      ) : data.results.length === 0 ? (
        <div className="flex h-[80vh] w-full items-center justify-center text-center text-black">
          No Camera present in this location or facility.
        </div>
      ) : (
        <Fullscreen
          fullscreenClassName="h-screen overflow-auto"
          fullscreen={isFullscreen}
          onExit={() => setFullscreen(false)}
        >
          <div className="mt-1 grid grid-cols-1 place-content-center gap-1 lg:grid-cols-2 3xl:grid-cols-3">
            {data.results.map((asset) => (
              <div className="text-clip" key={asset.id}>
                <LocationFeedTile
                  asset={asset}
                  fallbackMiddleware={
                    asset.location_object.middleware_address ||
                    facilityQuery.data?.middleware_address
                  }
                />
              </div>
            ))}
          </div>
        </Fullscreen>
      )}
    </Page>
  );
}
