import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserInfoPage from "@/pages/user/components/UserInfo";
import { ChevronLeft } from "lucide-react";

const PodcasterPage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();

  const backTo = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="w-[580px] mt-4">
        <ChevronLeft
          size={32}
          color="#25b4e1"
          className="cursor-pointer ml-[-60px]"
          onClick={backTo}
        />
      </div>
      <UserInfoPage uid={params.uid || ""} />
    </>
  );
};

export default PodcasterPage;
