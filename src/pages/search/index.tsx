import { ISearchPreset } from "@/types/type";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { api, request } from "@/utils";
import * as React from "react";
import { useNavigate } from "react-router-dom";

const Search: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchPresetValue, setSearchPresetValue] = useState<string>("搜索");
  const [searchPresetData, setSearchPresetData] = useState<ISearchPreset[]>([]);

  const navigate = useNavigate();

  let interval: any = null;

  const onSearchInput = (e: any) => {
    setSearchValue(e.target.value);
  };

  const querySearchPreset = () => {
    api
      .apiGetSearchPreset()
      .then((res) => {
        setSearchPresetData(res.data);
        //进行滚动
        scrollPreset();
      })
      .catch((e) => {
        if (e.status === 401) {
          request.reCallOn401(querySearchPreset);
        }
      });
  };

  const scrollPreset = () => {
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => {
      setSearchPresetValue((val) => {
        const index = searchPresetData.findIndex((cell) => cell.text === val);
        const firstValue =
          searchPresetData.length > 0 ? searchPresetData[0].text : "搜索";
        return index === -1
          ? firstValue
          : index + 1 >= searchPresetData.length
            ? firstValue
            : searchPresetData[index + 1].text;
      });
    }, 6000);
  };

  useEffect(() => {
    querySearchPreset();
  }, []);

  const onSearchKeyDown = (e: any) => {
    if (e.key === "Enter" && searchValue) {
      navigate(`/overview/search_result/${searchValue}`);
    }
  };

  return (
    <div className="flex mt-4 w-full justify-center items-center">
      <div className="flex items-center relative">
        <Input
          value={searchValue}
          onInput={onSearchInput}
          placeholder={searchPresetValue}
          className="w-[640px] pl-[36px]"
          onKeyDown={onSearchKeyDown}
        />
        <SearchIcon size={20} className="ml-2 absolute" />
      </div>
    </div>
  );
};

export default Search;
