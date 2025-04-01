import { useEffect } from "react";

import { ApBodyContainer, ApContainer, ApPageHeader, ApPageTitle } from "../../components";
import { useConfigState } from "./context";
import { ConfigDetail } from "./details";

const ConfigPage = () => {
  const { config, fetchCurrentConfig } = useConfigState();

  useEffect(() => {
    fetchCurrentConfig();
  }, []);

  return (
    <>
      <ApPageHeader title="Config" />

      <ApBodyContainer>
        <div className="relative pb-16">
          <ApContainer>
            <ConfigDetail config={config} />
          </ApContainer>
        </div>
      </ApBodyContainer>
    </>
  );
};

export default ConfigPage;
