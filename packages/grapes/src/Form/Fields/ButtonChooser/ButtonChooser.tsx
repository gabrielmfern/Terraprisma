import { Component, createMemo, children as accessChildren, JSX, on, ParentProps, createEffect, For } from "solid-js";
import Button, { ButtonProps } from "../../../General/Button/Button";
import { FieldValue } from "../../FormContext";
import FieldInternalWrapper from "../_Shared/FieldInternalWrapper/FieldInternalWrapper";

import { FieldProps, setupCommunicationWithFormContext, setupFieldsDisabledSignal, setupFieldsValueSignal } from "../_Shared/Utilts";

import "./ButtonChooser.scss";

export interface ButtonChooserProps extends FieldProps, ParentProps {
  label: JSX.Element;
  color?: 'primary' | 'secondary' | 'tertiary';
  helperText?: JSX.Element;

  onChange?: (newValue: FieldValue) => any;
}

export interface OptionProps extends ParentProps, ButtonProps {
  value: string;
}

const Option: Component<OptionProps> = (props) => {
  return props as unknown as JSX.Element;
};

const ButtonChooser = (props: ButtonChooserProps) => {
  const form = setupCommunicationWithFormContext(props);
  const [value, setValue] = setupFieldsValueSignal(props, form);
  const [disabled, _setDisabled] = setupFieldsDisabledSignal(props, form);

  const id = createMemo(() =>
    form
      ? `field-${form.identification()}-${props.name}`
      : `field-${props.name}`
  );

  const getChildren = accessChildren(() => props.children);
  const options = createMemo<OptionProps[]>(() => {
    let childrenArr: (JSX.Element | OptionProps)[];

    const children = getChildren();
    if (Array.isArray(children)) {
      childrenArr = children;
    } else {
      childrenArr = [children];
    }

    return childrenArr.filter(child => {
      return child !== null
        && typeof child === 'object'
        && Object.hasOwn(child, 'value')
        && Object.hasOwn(child, 'children');
    }) as OptionProps[];
  });

  createEffect(
    on(
      value, 
      () => {
        if (form) {
          form.validate(props.name);
        }
      },
      { defer: true }
    )
  );

  const color = createMemo(() => props.color || 'primary');

  return <FieldInternalWrapper
    id={id()}
    name={props.name}
    helperText={props.helperText}
    class="button-chooser"
    style={{
      height: 'fit-content'
    }}
  >
    <label for={id()} class="label">{props.label}</label>

    <div class="buttons">
      <For each={options()}>{(opt) => (
        <Button.Empty
          color={color()}
          disabled={disabled()}
          {...opt}
          classList={{
            'active': opt.value === value(),
            ...opt.classList
          }}
          onClick={(event) => {
            setValue(opt.value);

            if (opt.onClick) {
              opt.onClick(event);
            }
          }}
        >{opt.children}</Button.Empty>
      )}</For>
    </div>
  </FieldInternalWrapper>;
};

ButtonChooser.Option = Option;

export default ButtonChooser;
