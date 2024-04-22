import React from "react";
import styled from "styled-components";
import { ICurrentResponses } from "../interface";

const SidebarContainer = styled.div`
  width: 300px;
  color: #fafafa;
  border-left: 1px solid #ccc;
  padding: 20px;
  overflow-y: auto;
`;

const MenuItem = styled.div`
  margin-bottom: 10px;
`;

const MenuSidebar = ({ currentResponse = {} as ICurrentResponses }) => {
  return (
    <SidebarContainer>
      {currentResponse?.currentOrder?.map((order) => {
        return (
          <MenuItem>
            <h3>{order?.drink}</h3>{" "}
            <p>{order?.modifiers?.map((modifier) => modifier?.mod)}</p>
          </MenuItem>
        );
      })}
      {/* Add other menu items similarly */}
    </SidebarContainer>
  );
};

export default MenuSidebar;
