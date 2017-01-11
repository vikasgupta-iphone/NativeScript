﻿import {
    TextBaseCommon, formattedTextProperty, textAlignmentProperty, textDecorationProperty, fontSizeProperty,
    textProperty, textTransformProperty, letterSpacingProperty, colorProperty, fontInternalProperty,
    whiteSpaceProperty, Font, Color, FormattedString, TextDecoration, TextAlignment, TextTransform, WhiteSpace,
    paddingLeftProperty, paddingTopProperty, paddingRightProperty, paddingBottomProperty, Length
} from "./text-base-common";

export * from "./text-base-common";
export class TextBase extends TextBaseCommon {
    _transformationMethod: any;
    _nativeView: android.widget.TextView;

    public _setFormattedTextPropertyToNative(value: FormattedString) {
        if (this._nativeView) {
            let newText = value ? value._formattedText : this.text;
            this._nativeView.setText(newText);
        }
    }

    //Text
    get [textProperty.native](): string {
        return this._nativeView.getText();
    }
    set [textProperty.native](value: string) {
        const text = (value === null || value === undefined) ? '' : value.toString();
        this._nativeView.setText(text);
    }

    //FormattedText
    get [formattedTextProperty.native](): FormattedString {
        return null;
    }
    set [formattedTextProperty.native](value: FormattedString) {
        this._setFormattedTextPropertyToNative(value);
    }

    //Color
    get [colorProperty.native](): android.content.res.ColorStateList {
        return this._nativeView.getTextColors();
    }
    set [colorProperty.native](value: Color | android.content.res.ColorStateList) {
        if (value instanceof Color) {
            this._nativeView.setTextColor(value.android);
        } else {
            this._nativeView.setTextColor(value);
        }
    }

    //FontSize
    get [fontSizeProperty.native](): { nativeSize: number } {
        return { nativeSize: this._nativeView.getTextSize() };
    }
    set [fontSizeProperty.native](value: number | { nativeSize: number }) {
        if (typeof value === "number") {
            this._nativeView.setTextSize(value);
        } else {
            this._nativeView.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, value.nativeSize);
        }
    }

    //FontInternal
    get [fontInternalProperty.native](): { typeface: android.graphics.Typeface, fontSize: number } {
        let textView = this._nativeView;
        return {
            typeface: textView.getTypeface(),
            fontSize: textView.getTextSize()
        };
    }
    set [fontInternalProperty.native](value: Font | { typeface: android.graphics.Typeface, fontSize: number }) {
        let textView = this._nativeView;
        if (value instanceof Font) {
            // Set value. Note: Size is handled in fontSizeProperty.native
            textView.setTypeface(value.getAndroidTypeface());
        }
        else {
            // Reset value. Note: Resetting fontInternal will reset the size also.
            textView.setTypeface(value.typeface);
            textView.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, value.fontSize);
        }
    }


    //FontInternal
    get [fontInternalProperty.native](): { typeface: android.graphics.Typeface, fontSize: number } {
        let textView = this._nativeView;
        return {
            typeface: textView.getTypeface(),
            fontSize: textView.getTextSize()
        };
    }
    set [fontInternalProperty.native](value: Font | { typeface: android.graphics.Typeface, fontSize: number }) {
        let textView = this._nativeView;
        if (value instanceof Font) {
            // Set value
            textView.setTypeface(value.getAndroidTypeface());
            if (value.fontSize !== undefined) {
                textView.setTextSize(value.fontSize);
            }
        }
        else {
            // Reset value
            textView.setTypeface(value.typeface);
            textView.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, value.fontSize);
        }
    }

    //TextAlignment
    get [textAlignmentProperty.native](): TextAlignment {
        let textAlignmentGravity = this._nativeView.getGravity() & android.view.View.TEXT_ALIGNMENT_GRAVITY;
        switch (textAlignmentGravity) {
            case android.view.Gravity.LEFT:
                return TextAlignment.LEFT;
            case android.view.Gravity.CENTER_HORIZONTAL:
                return TextAlignment.CENTER;
            case android.view.Gravity.RIGHT:
                return TextAlignment.RIGHT;
            default:
                throw new Error(`Unsupported android.view.View.TEXT_ALIGNMENT_GRAVITY: ${textAlignmentGravity}. Currently supported values are android.view.Gravity.LEFT, android.view.Gravity.CENTER_HORIZONTAL, and android.view.Gravity.RIGHT.`);
        }
    }
    set [textAlignmentProperty.native](value: TextAlignment) {
        let verticalGravity = this._nativeView.getGravity() & android.view.Gravity.VERTICAL_GRAVITY_MASK;
        switch (value) {
            case TextAlignment.LEFT:
                this._nativeView.setGravity(android.view.Gravity.LEFT | verticalGravity);
                break;
            case TextAlignment.CENTER:
                this._nativeView.setGravity(android.view.Gravity.CENTER_HORIZONTAL | verticalGravity);
                break;
            case TextAlignment.RIGHT:
                this._nativeView.setGravity(android.view.Gravity.RIGHT | verticalGravity);
                break;
            default:
                throw new Error(`Invalid text alignment value: ${value}. Valid values are: "${TextAlignment.LEFT}", "${TextAlignment.CENTER}", "${TextAlignment.RIGHT}".`);
        }
    }

    //TextDecoration
    get [textDecorationProperty.native](): TextDecoration {
        return TextDecoration.NONE;
    }
    set [textDecorationProperty.native](value: TextDecoration) {
        let flags: number;

        switch (value) {
            case TextDecoration.NONE:
                flags = 0;
                break;
            case TextDecoration.UNDERLINE:
                flags = android.graphics.Paint.UNDERLINE_TEXT_FLAG;
                break;
            case TextDecoration.LINE_THROUGH:
                flags = android.graphics.Paint.STRIKE_THRU_TEXT_FLAG;
                break;
            case TextDecoration.UNDERLINE_LINE_THROUGH:
                flags = android.graphics.Paint.UNDERLINE_TEXT_FLAG | android.graphics.Paint.STRIKE_THRU_TEXT_FLAG;
                break;
            default:
                throw new Error(`Invalid text decoration value: ${value}. Valid values are: "${TextDecoration.NONE}", "${TextDecoration.UNDERLINE}", "${TextDecoration.LINE_THROUGH}", "${TextDecoration.UNDERLINE_LINE_THROUGH}".`);
        }

        this._nativeView.setPaintFlags(flags);
    }

    //TextTransform
    get [textTransformProperty.native](): android.text.method.TransformationMethod {
        return this._nativeView.getTransformationMethod();
    }
    set [textTransformProperty.native](value: TextTransform | android.text.method.TransformationMethod) {
        if (typeof value === "string") {
            this._nativeView.setTransformationMethod(new TextTransformation(this.text, this.formattedText, value));
        } else {
            this._nativeView.setTransformationMethod(value);
        }
    }

    //WhiteSpace
    get [whiteSpaceProperty.native](): WhiteSpace {
        return WhiteSpace.NORMAL;
    }
    set [whiteSpaceProperty.native](value: WhiteSpace) {
        let nativeView = this._nativeView;
        switch (value) {
            case WhiteSpace.NORMAL:
                nativeView.setSingleLine(false);
                nativeView.setEllipsize(null);
                break;
            case WhiteSpace.NO_WRAP:
                nativeView.setSingleLine(true);
                nativeView.setEllipsize(android.text.TextUtils.TruncateAt.END);
                break;
            default:
                throw new Error(`Invalid whitespace value: ${value}. Valid values are: "${WhiteSpace.NORMAL}", "${WhiteSpace.NO_WRAP}".`);
        }
    }

    get [letterSpacingProperty.native](): number {
        return org.nativescript.widgets.ViewHelper.getLetterspacing(this._nativeView);
    }
    set [letterSpacingProperty.native](value: number) {
        org.nativescript.widgets.ViewHelper.setLetterspacing(this._nativeView, value);
    }

    //PaddingTop
    get [paddingTopProperty.native](): Length {
        return { value: org.nativescript.widgets.ViewHelper.getPaddingTop(this.nativeView), unit: "px" };
    }
    set [paddingTopProperty.native](value: Length) {
        org.nativescript.widgets.ViewHelper.setPaddingTop(this.nativeView, Length.toDevicePixels(value, 0) + Length.toDevicePixels(this.style.borderTopWidth, 0));
    }

    //PaddingRight
    get [paddingRightProperty.native](): Length {
        return { value: org.nativescript.widgets.ViewHelper.getPaddingRight(this.nativeView), unit: "px" };
    }
    set [paddingRightProperty.native](value: Length) {
        org.nativescript.widgets.ViewHelper.setPaddingRight(this.nativeView, Length.toDevicePixels(value, 0) + Length.toDevicePixels(this.style.borderRightWidth, 0));
    }

    //PaddingBottom
    get [paddingBottomProperty.native](): Length {
        return { value: org.nativescript.widgets.ViewHelper.getPaddingBottom(this.nativeView), unit: "px" };
    }
    set [paddingBottomProperty.native](value: Length) {
        org.nativescript.widgets.ViewHelper.setPaddingBottom(this.nativeView, Length.toDevicePixels(value, 0) + Length.toDevicePixels(this.style.borderBottomWidth, 0));
    }

    //PaddingLeft
    get [paddingLeftProperty.native](): Length {
        return { value: org.nativescript.widgets.ViewHelper.getPaddingLeft(this.nativeView), unit: "px" };
    }
    set [paddingLeftProperty.native](value: Length) {
        org.nativescript.widgets.ViewHelper.setPaddingLeft(this.nativeView, Length.toDevicePixels(value, 0) + Length.toDevicePixels(this.style.borderLeftWidth, 0));
    }
}

@Interfaces([android.text.method.TransformationMethod])
class TextTransformation extends android.text.method.ReplacementTransformationMethod {
    constructor(public originalText: string, public formattedText: FormattedString, public textTransform: TextTransform) {
        super();
        return global.__native(this);
    }

    protected getOriginal(): native.Array<string> {
        let result: native.Array<string> = [];
        if (this.formattedText && this.formattedText._formattedText) {
            for (let i = 0, loopLength = this.formattedText._formattedText.length(); i < loopLength; i++) {
                result[i] = this.formattedText._formattedText.charAt(i);
            }
        } else {
            for (let i = 0, loopLength = this.originalText.length; i < loopLength; i++) {
                result[i] = this.originalText.charAt(i);
            }
        }
        return result;
    }

    private _getTransformedString(): string {
        let stringResult: string = "";
        let textTransform = this.textTransform;
        if (this.formattedText) {
            for (let i = 0, length = this.formattedText.spans.length; i < length; i++) {
                let span = this.formattedText.spans.getItem(i);
                stringResult += getTransformedText(span.text, textTransform);
            }
        }
        else {
            stringResult = getTransformedText(this.originalText, textTransform);
        }
        return stringResult;
    }

    protected getReplacement(): native.Array<string> {
        let transformedString = this._getTransformedString();
        let result: native.Array<string> = [];
        for (let i = 0, length = transformedString.length; i < length; i++) {
            result[i] = transformedString.charAt(i);
        }
        return result;
    }

    public getTransformation(charSeq: string, view: android.view.View): string {
        return this._getTransformedString();
    }
}

function getCapitalizedString(str: string): string {
    let words = str.split(" ");
    let newWords = [];
    for (let i = 0, length = words.length; i < length; i++) {
        let word = words[i].toLowerCase();
        newWords.push(word.substr(0, 1).toUpperCase() + word.substring(1));
    }

    return newWords.join(" ");
}

export function getTransformedText(text: string, textTransform: TextTransform): string {
    switch (textTransform) {
        case TextTransform.NONE:
            return text;
        case TextTransform.UPPERCASE:
            return text.toUpperCase();
        case TextTransform.LOWERCASE:
            return text.toLowerCase();
        case TextTransform.CAPITALIZE:
            return getCapitalizedString(text);
        default:
            throw new Error(`Invalid text transform value: ${textTransform}. Valid values are: "${TextTransform.NONE}", "${TextTransform.CAPITALIZE}", "${TextTransform.UPPERCASE}", "${TextTransform.LOWERCASE}".`);
    }
}