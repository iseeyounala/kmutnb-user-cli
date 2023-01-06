import {View, Text} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {XMarkIcon} from 'react-native-heroicons/outline';

const AlertModalFail = ({
  isModalHandel,
  title = false,
  titleText,
  detailText,
  onBackdropPress,
}) => {
  return (
    <Modal
      className="p-10"
      isVisible={isModalHandel}
      onBackdropPress={onBackdropPress}>
      <View className="flex-col bg-white rounded-md h-2/6 justify-center items-center">
        <View className="bg-red-500 h-15 w-15 p-4 rounded-full justify-center items-center mb-3">
          <XMarkIcon size={30} color="#FFFFFF" />
        </View>
        {!title ? (
          <Text
            className="text-lg font-normal"
            style={{fontFamily: 'Kanit-Light'}}>
            {detailText}
          </Text>
        ) : (
          <>
            <Text
              className="text-lg font-normal"
              style={{fontFamily: 'Kanit-Light'}}>
              {titleText}
            </Text>
            <Text
              className="text-lg font-normal"
              style={{fontFamily: 'Kanit-Light'}}>
              {detailText}
            </Text>
          </>
        )}
      </View>
    </Modal>
  );
};

export default AlertModalFail;
