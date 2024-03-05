import React from "react";

const sizeClasses = {
  txtManropeExtraBold46: "font-extrabold font-manrope",
  txtManropeBold18Gray900: "font-bold font-manrope",
  txtManropeBold18Gray600: "font-bold font-manrope",
  txtManropeExtraBold28: "font-extrabold font-manrope",
  txtManropeRegular20: "font-manrope font-normal",
  txtManropeExtraBold20: "font-extrabold font-manrope",
  txtManropeSemiBold16: "font-manrope font-semibold",
  txtManropeSemiBold18: "font-manrope font-semibold",
  txtManropeExtraBold36WhiteA700: "font-extrabold font-manrope",
  txtManropeRegular14: "font-manrope font-normal",
  txtManropeSemiBold12: "font-manrope font-semibold",
  txtManropeRegular18: "font-manrope font-normal",
  txtManropeSemiBold20Gray900: "font-manrope font-semibold",
  txtManropeSemiBold20Gray600: "font-manrope font-semibold",
  txtManropeSemiBold12Gray900: "font-manrope font-semibold",
  txtManropeSemiBold18Gray700: "font-manrope font-semibold",
  txtManropeBold18Deeporange400: "font-bold font-manrope",
  txtManropeBold24Gray900: "font-bold font-manrope",
  txtManropeSemiBold18Gray600: "font-manrope font-semibold",
  txtManropeBold18: "font-bold font-manrope",
  txtManropeBold1925: "font-bold font-manrope",
  txtManropeSemiBold16Gray600: "font-manrope font-semibold",
  txtManropeExtraBold54: "font-extrabold font-manrope",
  txtManropeSemiBold24Gray600: "font-manrope font-semibold",
  txtManropeSemiBold16Gray700: "font-manrope font-semibold",
  txtManropeRegular18Gray600: "font-manrope font-normal",
  txtManropeRegular18Gray700: "font-manrope font-normal",
  txtManropeExtraBold36: "font-extrabold font-manrope",
  txtManropeSemiBold20: "font-manrope font-semibold",
  txtManropeBold18OrangeA700: "font-bold font-manrope",
  txtManropeSemiBold1283: "font-manrope font-semibold",
  txtManropeBold24: "font-bold font-manrope",
  txtManropeSemiBold24: "font-manrope font-semibold",
  txtManropeBold22: "font-bold font-manrope",
  txtManropeMedium16: "font-manrope font-medium",
  txtMarkoOneRegular20: "font-markoone font-normal",
  txtManropeSemiBold1283Gray700: "font-manrope font-semibold",
};

const Text = ({ children, className = "", size, as, ...restProps }) => {
  const Component = as || "p";

  return (
    <Component
      className={`text-left ${className} ${size && sizeClasses[size]}`}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export { Text };
