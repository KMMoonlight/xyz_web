import DiscoveryPage from "@/pages/discovery/index";
import Search from "@/pages/search/index";
import RankPage from "@/pages/rank/index";
import * as React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="w-full max-h-[100vh] overflow-y-auto">
      <Search />
      <DiscoveryPage />
      <RankPage />
    </div>
  );
};

export default HomePage;
