import { useState } from "react";
import { AssetBedModel, AssetData } from "../Assets/AssetTypes";
import CameraFeed from "./CameraFeed";
import AssetBedSelect from "./AssetBedSelect";

interface Props {
  asset: AssetData;
  fallbackMiddleware?: string;
}

export default function LocationFeedTile(props: Props) {
  const [preset, setPreset] = useState<AssetBedModel>();

  return (
    <CameraFeed
      asset={props.asset}
      fallbackMiddleware={props.fallbackMiddleware as string}
      silent
      preset={preset?.meta.position}
      shortcutsDisabled
    >
      <div className="w-64">
        <AssetBedSelect
          asset={props.asset}
          value={preset}
          onChange={setPreset}
        />
      </div>
    </CameraFeed>
  );
}
