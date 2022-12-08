import React from "react";
import { Panel } from "src/Layouts/Panel";
import { PanelHome as PanelHomePage } from "../../pages/PanelHome";

export const PanelHome: React.FC = () => (
  <Panel>
    <PanelHomePage />
  </Panel>
);
PanelHome.displayName = "PanelHome";
