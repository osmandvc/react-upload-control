import { useEffect, useState } from "react";

/// based upon use-mobile-detect-hook project v1.0.5 on github from 14.06.2023

type Device = {
  isMobile?: boolean;
  isDesktop?: boolean;
  isAndroid?: boolean;
  isIos?: boolean;
  isSSR?: boolean;
};

const getMobileDetect = (userAgent: any): Device => {
  const isAndroid = Boolean(userAgent.match(/Android/i));
  const isIos = Boolean(userAgent.match(/iPhone|iPad|iPod/i));
  const isOpera = Boolean(userAgent.match(/Opera Mini/i));
  const isWindows = Boolean(userAgent.match(/IEMobile/i));
  const isSSR = Boolean(userAgent.match(/SSR/i));

  const isMobile = isAndroid || isIos || isOpera || isWindows;
  const isDesktop = !isMobile && !isSSR;

  return {
    isMobile,
    isDesktop,
    isAndroid,
    isIos,
    isSSR,
  };
};

export const useMobileDetect = () => {
  const userAgent =
    typeof navigator === "undefined" ? "SSR" : navigator.userAgent;
  const [device, setDevice] = useState<Device>({
    isMobile: undefined,
    isDesktop: undefined,
    isAndroid: undefined,
    isIos: undefined,
    isSSR: undefined,
  });

  useEffect(() => {
    if (userAgent) {
      setDevice(getMobileDetect(userAgent));
    }
  }, [userAgent]);

  return device;
};
