import React from 'react';
import {Image, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

const ResponsiveImage = ({source, height, widthPercentage = 100}) => {
  const imageWidth = (widthPercentage / 100) * width;
  const imageHeight = (height / 100) * imageWidth;

  return (
    <Image source={source} style={{width: imageWidth, height: imageHeight}} />
  );
};

export default ResponsiveImage;
