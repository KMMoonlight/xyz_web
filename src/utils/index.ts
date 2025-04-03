import * as request from "./request.ts";
import * as api from "./api.ts";
import * as storage from "./storage.ts";
import mitt from "mitt";

//时间转分钟
function transferTimeDurationToMinutes(seconds: number) {
  return Math.floor(seconds / 60);
}

//发布日期距今 <1小时显示分钟  <1天显示小时  <10天显示x天前  >=10天 显示日期
function showPubDateDiffDisplay(date: string) {
  const pubDate = new Date(date);
  const nowDate = new Date();
  const diff = nowDate.getTime() - pubDate.getTime();

  const minutes = Math.floor(diff / (60 * 1000));

  if (minutes < 60) {
    return `${minutes}分钟前`;
  }

  const hour = Math.floor(minutes / 60);

  if (hour < 24) {
    return `${hour}小时前`;
  }

  const day = Math.floor(hour / 24);

  if (day < 10) {
    return `${day}天前`;
  }
  const month = pubDate.getMonth() + 1;
  const displayDay = pubDate.getDate();
  const displayDate = `${month < 10 ? "0" + month : month}/${displayDay < 10 ? "0" + displayDay : displayDay}`;
  return pubDate.getFullYear() === nowDate.getFullYear()
    ? displayDate
    : `${pubDate.getFullYear()}/${displayDate}`;
}

//评论99+
function formatCommentCount(count: number) {
  return count > 99 ? "99+" : count;
}

//获取UID
function getUserID() {
  const userInstance: any = JSON.parse(
    storage.getStorageItem("JikeUserInfo", "{}")
  );

  if (userInstance["uid"]) {
    return userInstance.uid;
  }

  return "";
}

function timeToHours(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);

  return {
    hours,
    minutes,
  };
}

function highlightTime(str: string) {
  str = str.replace(/font-family:/g, 'font-family:LXGW WenKai TC,')

  
  return str.replace(
    /\b(\d{1,2}):([0-5][0-9])(?::([0-5][0-9]))?\b/g,
    '<span class="highlight-time">$&</span>'
  );
}

const emitter = mitt();

export {
  request,
  api,
  storage,
  transferTimeDurationToMinutes,
  showPubDateDiffDisplay,
  formatCommentCount,
  getUserID,
  timeToHours,
  highlightTime,
  emitter,
};
