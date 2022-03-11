import color from 'color';
import * as React from 'react';
import {
  ColorValue,
  I18nManager,
  Platform,
  StyleSheet,
  TextInput as NativeTextInput,
  TextStyle,
  View,
} from 'react-native';
import { AdornmentSide, AdornmentType } from './Adornment/enums';
import TextInputAdornment, {
  getAdornmentConfig,
  getAdornmentStyleAdjustmentForNativeInput,
  TextInputAdornmentProps,
} from './Adornment/TextInputAdornment';
import {
  ADORNMENT_OFFSET,
  ADORNMENT_SIZE,
  LABEL_WIGGLE_X_OFFSET,
  MAXIMIZED_LABEL_FONT_SIZE,
  MINIMIZED_LABEL_FONT_SIZE,
} from './constants';
import {
  adjustPaddingOut,
  calculateInputHeight,
  calculateLabelTopPosition,
  calculateOutlinedIconAndAffixTopPosition,
  calculatePadding,
  interpolatePlaceholder,
  Padding,
} from './helpers';
import InputLabel from './Label/InputLabel';
import LabelBackground from './Label/LabelBackground';
import type { ChildTextInputProps, RenderProps } from './types';

const OUTLINE_MINIMIZED_LABEL_Y_OFFSET = -6;
const LABEL_PADDING_TOP = 8;
const MIN_HEIGHT = 64;
const MIN_DENSE_HEIGHT = 48;
const INPUT_PADDING_HORIZONTAL = 14;

const TextInputOutlined = ({
  disabled = false,
  editable = true,
  label,
  error = false,
  selectionColor,
  underlineColor: _underlineColor,
  outlineColor: customOutlineColor,
  activeOutlineColor,
  dense,
  style,
  theme,
  render = (props: RenderProps) => <NativeTextInput {...props} />,
  multiline = false,
  parentState,
  innerRef,
  onFocus,
  forceFocus,
  onBlur,
  onChangeText,
  onLayoutAnimatedText,
  onLeftAffixLayoutChange,
  onRightAffixLayoutChange,
  left,
  right,
  placeholderTextColor,
  ...rest
}: ChildTextInputProps) => {
  const adornmentConfig = getAdornmentConfig({ left, right });

  const { colors, fonts } = theme;
  const font = fonts.regular;
  const hasActiveOutline = parentState.focused || error;

  const {
    fontSize: fontSizeStyle,
    fontWeight,
    lineHeight,
    height,
    backgroundColor = colors.background,
    textAlign,
    ...viewStyle
  } = (StyleSheet.flatten(style) || {}) as TextStyle;
  const fontSize = fontSizeStyle || MAXIMIZED_LABEL_FONT_SIZE;

  let inputTextColor, activeColor, outlineColor, placeholderColor, errorColor;

  if (disabled) {
    const isTransparent = color(customOutlineColor).alpha() === 0;
    inputTextColor = activeColor = color(colors.text)
      .alpha(0.54)
      .rgb()
      .string();
    placeholderColor = colors.disabled;
    outlineColor = isTransparent ? customOutlineColor : colors.disabled;
  } else {
    inputTextColor = colors.text;
    activeColor = error ? colors.error : activeOutlineColor || colors.primary;
    placeholderColor = colors.placeholder;
    outlineColor = customOutlineColor || colors.placeholder;
    errorColor = colors.error;
  }

  const labelScale = MINIMIZED_LABEL_FONT_SIZE / fontSize;
  const fontScale = MAXIMIZED_LABEL_FONT_SIZE / fontSize;

  const labelWidth = parentState.labelLayout.width;
  const labelHeight = parentState.labelLayout.height;
  const labelHalfWidth = labelWidth / 2;
  const labelHalfHeight = labelHeight / 2;

  const baseLabelTranslateX =
    (I18nManager.isRTL ? 1 : -1) *
    (labelHalfWidth -
      (labelScale * labelWidth) / 2 -
      (fontSize - MINIMIZED_LABEL_FONT_SIZE) * labelScale);

  let labelTranslationXOffset = 0;
  const isAdornmentLeftIcon = adornmentConfig.some(
    ({ side, type }) =>
      side === AdornmentSide.Left && type === AdornmentType.Icon,
  );
  if (isAdornmentLeftIcon) {
    labelTranslationXOffset =
      (I18nManager.isRTL ? -1 : 1) * (ADORNMENT_SIZE + ADORNMENT_OFFSET - 8);
  }

  const minInputHeight =
    (dense ? MIN_DENSE_HEIGHT : MIN_HEIGHT) - LABEL_PADDING_TOP;

  const inputHeight = calculateInputHeight(labelHeight, height, minInputHeight);

  const topPosition = calculateLabelTopPosition(
    labelHeight,
    inputHeight,
    LABEL_PADDING_TOP,
  );

  if (height && typeof height !== 'number') {
    // eslint-disable-next-line
    console.warn('Currently we support only numbers in height prop');
  }

  const paddingSettings = {
    dense: dense ? dense : null,
    fontSize,
    height: height ? +height : null,
    isAndroid: Platform.OS === 'android',
    label,
    labelHalfHeight,
    lineHeight,
    multiline: multiline ? multiline : null,
    offset: LABEL_PADDING_TOP,
    scale: fontScale,
    styles: StyleSheet.flatten(
      dense ? styles.inputOutlinedDense : styles.inputOutlined,
    ) as Padding,
    topPosition,
  };

  const pad = calculatePadding(paddingSettings);

  const paddingOut = adjustPaddingOut({ ...paddingSettings, pad });

  const baseLabelTranslateY =
    -labelHalfHeight - (topPosition + OUTLINE_MINIMIZED_LABEL_Y_OFFSET);

  const placeholderOpacity = hasActiveOutline
    ? interpolatePlaceholder(parentState.labeled, hasActiveOutline)
    : parentState.labelLayout.measured
    ? 1
    : 0;

  const labelProps = {
    activeColor,
    backgroundColor: backgroundColor as ColorValue,
    baseLabelTranslateX,
    baseLabelTranslateY,
    error,
    errorColor,
    font,
    fontSize,
    fontWeight,
    hasActiveOutline,
    label,
    labelScale,
    labelTranslationXOffset,
    onLayoutAnimatedText,
    placeholderColor,
    placeholderOpacity,
    placeholderStyle: styles.placeholder,
    roundness: theme.roundness,
    topPosition,
    wiggleOffsetX: LABEL_WIGGLE_X_OFFSET,
  };

  const minHeight = (height ||
    (dense ? MIN_DENSE_HEIGHT : MIN_HEIGHT)) as number;

  const { leftLayout, rightLayout } = parentState;

  const leftAffixTopPosition = calculateOutlinedIconAndAffixTopPosition({
    affixHeight: leftLayout.height || 0,
    height: minHeight,
    labelYOffset: -OUTLINE_MINIMIZED_LABEL_Y_OFFSET,
  });

  const rightAffixTopPosition = calculateOutlinedIconAndAffixTopPosition({
    affixHeight: rightLayout.height || 0,
    height: minHeight,
    labelYOffset: -OUTLINE_MINIMIZED_LABEL_Y_OFFSET,
  });
  const iconTopPosition = calculateOutlinedIconAndAffixTopPosition({
    affixHeight: ADORNMENT_SIZE,
    height: minHeight,
    labelYOffset: -OUTLINE_MINIMIZED_LABEL_Y_OFFSET,
  });

  const rightAffixWidth = right
    ? rightLayout.width || ADORNMENT_SIZE
    : ADORNMENT_SIZE;

  const leftAffixWidth = left
    ? leftLayout.width || ADORNMENT_SIZE
    : ADORNMENT_SIZE;

  const adornmentStyleAdjustmentForNativeInput =
    getAdornmentStyleAdjustmentForNativeInput({
      adornmentConfig,
      leftAffixWidth,
      mode: 'outlined',
      rightAffixWidth,
    });
  const affixTopPosition = {
    [AdornmentSide.Left]: leftAffixTopPosition,
    [AdornmentSide.Right]: rightAffixTopPosition,
  };
  const onAffixChange = {
    [AdornmentSide.Left]: onLeftAffixLayoutChange,
    [AdornmentSide.Right]: onRightAffixLayoutChange,
  };

  let adornmentProps: TextInputAdornmentProps = {
    adornmentConfig,
    forceFocus,
    isTextInputFocused: parentState.focused,
    onAffixChange,
    topPosition: {
      [AdornmentType.Icon]: iconTopPosition,
      [AdornmentType.Affix]: affixTopPosition,
    },
  };
  if (adornmentConfig.length) {
    adornmentProps = {
      ...adornmentProps,
      left,
      right,
      textStyle: { ...font, fontSize, fontWeight },
      visible: parentState.labeled,
    };
  }

  return (
    <View style={viewStyle}>
      {/*
          Render the outline separately from the container
          This is so that the label can overlap the outline
          Otherwise the border will cut off the label on Android
          */}
      <Outline
        activeColor={activeColor}
        backgroundColor={backgroundColor}
        focused={parentState.focused}
        hasActiveOutline={hasActiveOutline}
        outlineColor={outlineColor}
        theme={theme}
      />
      <View>
        <View
          style={[
            styles.labelContainer,
            {
              minHeight,
              paddingTop: LABEL_PADDING_TOP,
            },
          ]}
        >
          <InputLabel
            labelBackground={LabelBackground}
            labelProps={labelProps}
            parentState={parentState}
          />
          {render?.({
            testID: 'text-input-outlined',
            ...rest,
            editable: !disabled && editable,
            multiline,
            onBlur,
            onChangeText,
            onFocus,
            placeholder: label ? parentState.placeholder : rest.placeholder,
            placeholderTextColor: placeholderTextColor || placeholderColor,
            ref: innerRef,
            selectionColor:
              typeof selectionColor === 'undefined'
                ? activeColor
                : selectionColor,
            style: [
              styles.input,
              !multiline || (multiline && height)
                ? { height: inputHeight }
                : {},
              paddingOut,
              {
                ...font,
                color: inputTextColor,
                fontSize,
                fontWeight,
                textAlign: textAlign
                  ? textAlign
                  : I18nManager.isRTL
                  ? 'right'
                  : 'left',
                textAlignVertical: multiline ? 'top' : 'center',
              },
              Platform.OS === 'web' && { outline: 'none' },
              adornmentStyleAdjustmentForNativeInput,
            ],
            underlineColorAndroid: 'transparent',
          } as RenderProps)}
        </View>
        <TextInputAdornment {...adornmentProps} />
      </View>
    </View>
  );
};

export default TextInputOutlined;

type OutlineProps = {
  activeColor: string;
  hasActiveOutline?: boolean;
  focused?: boolean;
  outlineColor?: string;
  backgroundColor: ColorValue;
  theme: ReactNativePaper.Theme;
};

const Outline = ({
  theme,
  hasActiveOutline,
  activeColor,
  outlineColor,
  focused,
  backgroundColor,
}: OutlineProps) => (
  <View
    pointerEvents="none"
    style={[
      styles.outline,
      {
        backgroundColor,
        borderColor: hasActiveOutline ? activeColor : outlineColor,
        borderRadius: theme.roundness,
        borderWidth: focused ? 2 : 1,
      },
    ]}
    testID="text-input-outline"
  />
);

const styles = StyleSheet.create({
  input: {
    flexGrow: 1,
    margin: 0,
    paddingHorizontal: INPUT_PADDING_HORIZONTAL,
    zIndex: 1,
  },
  inputOutlined: {
    paddingBottom: 8,
    paddingTop: 8,
  },
  inputOutlinedDense: {
    paddingBottom: 4,
    paddingTop: 4,
  },
  labelContainer: {
    paddingBottom: 0,
  },
  outline: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 6,
  },
  placeholder: {
    left: 0,
    paddingHorizontal: INPUT_PADDING_HORIZONTAL,
    position: 'absolute',
  },
});
