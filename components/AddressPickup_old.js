import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {KEY_API_GOOGLE} from '@env';

const AddressPickup = ({placeholderText, fetchAddress}) => {
  const onPressAddress = (data, details) => {
    // console.log('detail >>>>>>>', details);
    const lat = details.geometry.location.lat;
    const lng = details.geometry.location.lng;
    fetchAddress(lat, lng);
  };
  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder={placeholderText}
        fetchDetails={true}
        onPress={onPressAddress}
        query={{
          key: KEY_API_GOOGLE,
          language: 'th',
        }}
        styles={{
          textInputContainer: styles.containerStyle,
          textInput: styles.textInputStyle,
        }}
      />
    </View>
  );
};

export default AddressPickup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerStyle: {
    backgroundColor: 'white',
  },
  textInputStyle: {
    height: 48,
    color: 'black',
    fontSize: 16,
    backgroundColor: '#F3F3F3',
  },
});
