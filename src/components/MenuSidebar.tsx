import React from 'react';
import styled from 'styled-components';

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

const MenuSidebar: React.FC = () => {
  return (
    <SidebarContainer>
      <MenuItem>Cappuccino</MenuItem>
      <MenuItem>Latte</MenuItem>
      {/* Add other menu items similarly */}
    </SidebarContainer>
  );
};

export default MenuSidebar;
