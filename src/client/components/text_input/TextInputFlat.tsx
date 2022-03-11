import * as React from 'react';
import {
  Animated,
  I18nManager,
  Platform,
  StyleSheet,
  TextInput as NativeTextInput,
  TextStyle,
  View,
} from 'react-native';
import color from 'src/client/utils/color';
import { AdornmentSide, AdornmentType, InputMode } from './Adornment/enums';
import TextInputAdornment, {
  getAdornmentConfig,
  getAdornmentStyleAdjustmentForNativeInput,
  TextInputAdornmentProps,
} from './Adornment/TextInputAdornment';
import {
  ADORNMENT_SIZE,
  FLAT_INPUT_OFFSET,
  LABEL_WIGGLE_X_OFFSET,
  MAXIMIZED_LABEL_FONT_SIZE,
  MINIMIZED_LABEL_FONT_SIZE,
} from './constants';
import {
  adjustPaddingFlat,
  calculateFlatAffixTopPosition,
  calculateFlatInputHorizontalPadding,
  calculateInputHeight,
  calculateLabelTopPosition,
  calculatePadding,
  interpolatePlaceholder,
  Padding,
} from './helpers';
import InputLabel from './Label/InputLabel';
import type { ChildTextInputProps, RenderProps } from './types';

const MINIMIZED_LABEL_Y_OFFSET = -18;

const LABEL_PADDING_TOP = 30;
const LABEL_PADDING_TOP_DENSE = 24;
const MIN_HEIGHT = 64;
const MIN_DENSE_HEIGHT_WL = 52;
const MIN_DENSE_HEIGHT = 40;

const TextInputFlat = ({
  disabled = false,
  editable = true,
  label,
  error = false,
  selectionColor,
  underlineColor,
  activeUnderlineColor,
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
  const isAndroid = Platform.OS === 'android';
  const { colors, fonts } = theme;
  const font = fonts.regular;
  const hasActiveOutline = parentState.focused || error;

  const {
    fontSize: fontSizeStyle,
    fontWeight,
    height,
    paddingHorizontal,
    textAlign,
    ...viewStyle
  } = (StyleSheet.flatten(style) || {}) as TextStyle;
  const fontSize = fontSizeStyle || MAXIMIZED_LABEL_FONT_SIZE;

  const isPaddingHorizontalPassed =
    paddingHorizontal !== undefined && typeof paddingHorizontal === 'number';

  const adornmentConfig = getAdornmentConfig({
    left,
    right,
  });

  let { paddingLeft, paddingRight } = calculateFlatInputHorizontalPadding({
    adornmentConfig,
  });

  if (isPaddingHorizontalPassed) {
    paddingLeft = paddingHorizontal as number;
    paddingRight = paddingHorizontal as number;
  }

  const { leftLayout, rightLayout } = parentState;

  const rightAffixWidth = right
    ? rightLayout.width || ADORNMENT_SIZE
    : ADORNMENT_SIZE;

  const leftAffixWidth = left
    ? leftLayout.width || ADORNMENT_SIZE
    : ADORNMENT_SIZE;

  const adornmentStyleAdjustmentForNativeInput =
    getAdornmentStyleAdjustmentForNativeInput({
      adornmentConfig,
      inputOffset: FLAT_INPUT_OFFSET,
      leftAffixWidth,
      mode: InputMode.Flat,
      paddingHorizontal,
      rightAffixWidth,
    });

  let inputTextColor,
    activeColor,
    underlineColorCustom,
    placeholderColor,
    errorColor;

  if (disabled) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inputTextColor = activeColor = (color(colors.text) as any)
      .alpha(0.54)
      .rgb()
      .string();
    placeholderColor = colors.disabled;
    underlineColorCustom = 'transparent';
  } else {
    inputTextColor = colors.text;
    activeColor = error ? colors.error : activeUnderlineColor || colors.primary;
    placeholderColor = colors.placeholder;
    errorColor = colors.error;
    underlineColorCustom = underlineColor || colors.disabled;
  }

  const containerStyle = {
    backgroundColor: theme.dark
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (color(colors.background) as any).lighten(0.24).rgb().string()
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (color(colors.background) as any).darken(0.06).rgb().string(),
    borderTopLeftRadius: theme.roundness,
    borderTopRightRadius: theme.roundness,
  };

  const labelScale = MINIMIZED_LABEL_FONT_SIZE / fontSize;
  const fontScale = MAXIMIZED_LABEL_FONT_SIZE / fontSize;

  const labelWidth = parentState.labelLayout.width;
  const labelHeight = parentState.labelLayout.height;
  const labelHalfWidth = labelWidth / 2;
  const labelHalfHeight = labelHeight / 2;

  const baseLabelTranslateX =
    (I18nManager.isRTL ? 1 : -1) *
      (labelHalfWidth - (labelScale * labelWidth) / 2) +
    (1 - labelScale) * (I18nManager.isRTL ? -1 : 1) * paddingLeft;

  const minInputHeight = dense
    ? (label ? MIN_DENSE_HEIGHT_WL : MIN_DENSE_HEIGHT) - LABEL_PADDING_TOP_DENSE
    : MIN_HEIGHT - LABEL_PADDING_TOP;

  const inputHeight = calculateInputHeight(labelHeight, height, minInputHeight);

  const topPosition = calculateLabelTopPosition(
    labelHeight,
    inputHeight,
    multiline && height ? 0 : !height ? minInputHeight / 2 : 0,
  );

  if (height && typeof height !== 'number') {
    // eslint-disable-next-line
    console.warn('Currently we support only numbers in height prop');
  }

  const paddingSettings = {
    dense: dense ? dense : null,
    fontSize,
    height: height ? +height : null,
    isAndroid,
    label,
    labelHalfHeight,
    multiline: multiline ? multiline : null,
    offset: FLAT_INPUT_OFFSET,
    scale: fontScale,
    styles: StyleSheet.flatten(
      dense ? styles.inputFlatDense : styles.inputFlat,
    ) as Padding,
    topPosition,
  };

  const pad = calculatePadding(paddingSettings);

  const paddingFlat = adjustPaddingFlat({
    ...paddingSettings,
    pad,
  });

  const baseLabelTranslateY =
    -labelHalfHeight - (topPosition + MINIMIZED_LABEL_Y_OFFSET);

  const placeholderOpacity = hasActiveOutline
    ? interpolatePlaceholder(parentState.labeled, hasActiveOutline)
    : parentState.labelLayout.measured
    ? 1
    : 0;

  const minHeight =
    height ||
    (dense ? (label ? MIN_DENSE_HEIGHT_WL : MIN_DENSE_HEIGHT) : MIN_HEIGHT);

  const flatHeight =
    inputHeight +
    (!height ? (dense ? LABEL_PADDING_TOP_DENSE : LABEL_PADDING_TOP) : 0);

  const iconTopPosition = (flatHeight - ADORNMENT_SIZE) / 2;

  const leftAffixTopPosition = leftLayout.height
    ? calculateFlatAffixTopPosition({
        height: flatHeight,
        ...paddingFlat,
        affixHeight: leftLayout.height,
      })
    : null;

  const rightAffixTopPosition = rightLayout.height
    ? calculateFlatAffixTopPosition({
        height: flatHeight,
        ...paddingFlat,
        affixHeight: rightLayout.height,
      })
    : null;

  const labelProps = {
    activeColor,
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
    onLayoutAnimatedText,
    paddingOffset: { paddingLeft, paddingRight },
    placeholderColor,
    placeholderOpacity,
    placeholderStyle: styles.placeholder,
    roundness: theme.roundness,
    topPosition,
    wiggleOffsetX: LABEL_WIGGLE_X_OFFSET,
  };
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
    paddingHorizontal,
    topPosition: {
      [AdornmentType.Affix]: affixTopPosition,
      [AdornmentType.Icon]: iconTopPosition,
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
    <View style={[containerStyle, viewStyle]}>
      <Underline
        activeColor={activeColor}
        colors={colors}
        error={error}
        parentState={parentState}
        underlineColorCustom={underlineColorCustom}
      />
      <View
        style={[
          styles.labelContainer,
          {
            minHeight,
          },
        ]}
      >
        {!isAndroid && multiline && label && (
          // Workaround for: https://github.com/callstack/react-native-paper/issues/2799
          // Patch for a multiline TextInput with fixed height, which allow to avoid covering input label with its value.
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              dense ? styles.densePatchContainer : styles.patchContainer,
              {
                backgroundColor:
                  viewStyle.backgroundColor || containerStyle.backgroundColor,
                left: paddingLeft,
                right: paddingRight,
              },
            ]}
            testID="patch-container"
          />
        )}
        <InputLabel labelProps={labelProps} parentState={parentState} />
        {render?.({
          ...rest,
          editable: !disabled && editable,
          multiline,
          onBlur,
          onChangeText,
          onFocus,
          placeholder: label ? parentState.placeholder : rest.placeholder,
          placeholderTextColor: placeholderTextColor ?? placeholderColor,
          ref: innerRef,
          selectionColor:
            typeof selectionColor === 'undefined'
              ? activeColor
              : selectionColor,
          style: [
            styles.input,
            { paddingLeft, paddingRight },
            !multiline || (multiline && height) ? { height: flatHeight } : {},
            paddingFlat,
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
        })}
      </View>
      <TextInputAdornment {...adornmentProps} />
    </View>
  );
};

export default TextInputFlat;

type UnderlineProps = {
  parentState: {
    focused: boolean;
  };
  error?: boolean;
  colors: {
    error: string;
  };
  activeColor: string;
  underlineColorCustom?: string;
};

const Underline = ({
  parentState,
  error,
  colors,
  activeColor,
  underlineColorCustom,
}: UnderlineProps) => {
  let backgroundColor = parentState.focused
    ? activeColor
    : underlineColorCustom;
  if (error) backgroundColor = colors.error;
  return (
    <Animated.View
      style={[
        styles.underline,
        {
          backgroundColor,
          // Underlines is thinner when input is not focused
          transform: [{ scaleY: parentState.focused ? 1 : 0.5 }],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  densePatchContainer: {
    height: 22,
    zIndex: 2,
  },
  input: {
    flexGrow: 1,
    margin: 0,
  },
  inputFlat: {
    paddingBottom: 4,
    paddingTop: 24,
  },
  inputFlatDense: {
    paddingBottom: 2,
    paddingTop: 22,
  },
  labelContainer: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  patchContainer: {
    height: 24,
    zIndex: 2,
  },
  placeholder: {
    left: 0,
    position: 'absolute',
  },
  underline: {
    bottom: 0,
    height: 2,
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },
});
