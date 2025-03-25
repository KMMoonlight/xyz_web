import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api, storage } from "@/utils/index";
import { toast } from "sonner";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const phoneNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const LoginPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [smsCode, setSMSCode] = useState<string>("");
  const [loginDisabled, setLoginDisabled] = useState<boolean>(true);
  const [sendCodeDisabled, setSendCodeDisabled] = useState<boolean>(true);

  const [sendCodeLoading, setSendCodeLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const onPhoneNumberInput = (e: any) => {
    setPhoneNumber(e.currentTarget.value);
  };

  const onSMSCodeInput = (e: any) => {
    setSMSCode(e.target.value);
  };

  const onPhoneNumberBlur = () => {
    setPhoneNumber((value) => {
      return value
        .split("")
        .filter((cell) => phoneNumbers.includes(cell))
        .join("");
    });
  };

  const sendCode = () => {
    //发送验证码
    setSendCodeDisabled(true);
    setSendCodeLoading(true);
    api
      .apiSendSMSCode({
        mobilePhoneNumber: phoneNumber,
        areaCode: "+86",
      })
      .then(() => {
        toast("发送成功!");
      })
      .finally(() => {
        setSendCodeDisabled(false);
        setSendCodeLoading(false);
      });
  };

  const doLogin = () => {
    setLoginDisabled(true);
    setSubmitLoading(true);
    api
      .apiLogin({
        areaCode: "+86",
        verifyCode: smsCode,
        mobilePhoneNumber: phoneNumber,
      })
      .then((res: any) => {
        storage.setStorageItem("JikeUserInfo", JSON.stringify(res.data.user));
        toast("登录成功");
        navigate("/", { replace: true });
      })
      .finally(() => {
        setLoginDisabled(false);
        setSubmitLoading(false);
      });
  };

  useEffect(() => {
    setSendCodeDisabled(() => phoneNumber.length !== 11);
    setLoginDisabled(() => phoneNumber.length !== 11 || smsCode.length !== 4);
  }, [phoneNumber, smsCode]);

  useEffect(() => {
    const isLogin =
      storage.getStorageItem("XJikeAccessToken") &&
      storage.getStorageItem("XJikeRefreshToken");

    if (isLogin) {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-2xl font-bold">手机验证登录</div>
        <div className="flex w-full max-w-sm items-center mt-4">
          +86
          <Input
            value={phoneNumber}
            type="tel"
            placeholder="请输入手机号"
            className="ml-2"
            onInput={onPhoneNumberInput}
            onBlur={onPhoneNumberBlur}
          />
        </div>
        <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
          <Input
            value={smsCode}
            type="text"
            placeholder="请输入验证码"
            onInput={onSMSCodeInput}
          />
          <Button disabled={sendCodeDisabled} onClick={sendCode}>
            {sendCodeLoading && <Loader2 className="animate-spin" />}
            发送验证码
          </Button>
        </div>

        <div className="flex w-full max-w-sm items-center mt-4">
          <Button disabled={loginDisabled} onClick={doLogin} className="w-full">
            {submitLoading && <Loader2 className="animate-spin" />}
            登录
          </Button>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
