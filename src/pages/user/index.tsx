import * as React from "react";
import { getUserID } from "@/utils/index";

import UserInfoPage from "./components/UserInfo";

const UserPage: React.FC = () => {
  return <UserInfoPage uid={getUserID()} />;
};

export default UserPage;
