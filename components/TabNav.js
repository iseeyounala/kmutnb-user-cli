import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {HomeIcon, ClockIcon} from 'react-native-heroicons/outline';
const TabNav = ({color, size, iconName, focus}) => {
  useEffect(() => {
    console.log(iconName);
  }, []);
  return (
    <>
      {iconName == 'หน้าหลัก' && focus ? (
        <HomeIcon size={size} color={color} />
      ) : (
        <HomeIcon size={size} color={color} />
      )}
      {iconName == 'ประวัติ' && focus ? (
        <ClockIcon size={size} color={color} />
      ) : (
        <ClockIcon size={size} color={color} />
      )}
    </>
  );
};

export default TabNav;
