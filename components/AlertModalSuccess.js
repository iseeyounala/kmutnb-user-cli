import {View, Text} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {CheckIcon} from 'react-native-heroicons/outline';

const AlertModalSuccess = ({isModalHandel, detailText, onBackdropPress}) => {
  return (
    <Modal
      className="p-10"
      isVisible={isModalHandel}
      onBackdropPress={onBackdropPress}>
      <View className="flex-col bg-white rounded-md h-2/6 justify-center items-center">
        <View className="bg-green-500 h-15 w-15 p-4 rounded-full justify-center items-center mb-3">
          <CheckIcon size={30} color="#FFFFFF" />
        </View>
        <Text
          className="text-lg font-normal"
          style={{fontFamily: 'Kanit-Light'}}>
          {detailText}
        </Text>
      </View>
    </Modal>
  );
};

export default AlertModalSuccess;
