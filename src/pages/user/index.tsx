import * as React from "react";
import { getUserID } from "@/utils/index";

import UserInfoPage from "./components/UserInfo";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const UserPage: React.FC = () => {
  const logout = () => {
    localStorage.removeItem("JikeUserInfo");
    localStorage.removeItem("XJikeAccessToken");
    localStorage.removeItem("XJikeRefreshToken");
    window.location.href = "/";
    toast("退出成功!");
  };

  return (
    <>
      <UserInfoPage uid={getUserID()} currentUser={true} />
      <div className="h-[1px] w-[520px] bg-gray-200 mt-4" />
      <Button
        variant="destructive"
        className="mt-[30px] cursor-pointer"
        onClick={logout}
      >
        退出登录
      </Button>
    </>
  );
};

export default UserPage;
