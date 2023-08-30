import {
  ComponentProps,
  For,
  children as accessChildren,
  JSX,
  ParentProps,
  Show,
  createMemo,
  createSignal,
  Component
} from 'solid-js';

import {
  setupFieldComponent,
  FieldInternalWrapper,
  Label,
  FieldName,
  FieldProps,
  FieldPropKeys,
  useField
} from '../utils';

import {
  mergeCallbacks,
  mergeClass,
  createComponentExtendingFromOther
} from '@grapos/utils';

import { ClickableSignalizer, Ripple } from '@grapos/core';
import { Stack } from '@grapos/layout';
import type { StackProps } from '@grapos/layout/Stack/Stack';

import { FormValue, FormFieldValue } from '../../types';

import './RadioGroup.scss';

export interface RadioGroupOptionProps<
  AllowedValue extends FormFieldValue = FormFieldValue
> extends ParentProps {
  value: AllowedValue;

  color?: 'accent' | `accent-${string}`;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;

  onClick?: (e: MouseEvent) => void;
}

const RadioOption = (
  props: RadioGroupOptionProps &
    Omit<ComponentProps<'input'>, keyof RadioGroupOptionProps>
) => props as unknown as JSX.Element;

const RadioInternal = createComponentExtendingFromOther<
  RadioGroupOptionProps,
  'input'
>(
  (props, elProps) => {
    const {
      elementId: groupId,
      valueS: [groupValue],
      disabledS: [groupDisabled],

      hasErrors
    } = useField<string>()!;

    const id = createMemo(() => `${groupId()}-${props.value}`);

    const [isRadioFocused, setRadioToFocused] = createSignal(false);

    const isDisabled = createMemo(() => props.disabled || groupDisabled());
    const isChecked = createMemo(() => props.value === groupValue());

    const color = createMemo(() => props.color || 'accent');

    return (
      <div
        class="radio-container"
        onClick={(e) => {
          if (props.onClick && !isDisabled()) {
            props.onClick(e);
          }
        }}
      >
        <div
          class="radio"
          style={{
            '--color': `var(--${color()}-bg)`,
            '--check-color': `var(--${color()}-fg)`
          }}
          classList={{
            small: props.size === 'small',
            medium: props.size === 'medium',
            large: props.size === 'large',

            checked: isChecked(),
            disabled: isDisabled()
          }}
          onMouseEnter={() => setRadioToFocused(true)}
          onMouseLeave={() => setRadioToFocused(false)}
        >
          <ClickableSignalizer
            color={isChecked() ? `var(--${props.color})` : undefined}
            show={isRadioFocused() && !isDisabled()}
            class="radio-internal"
          >
            <Ripple noRipple={isDisabled()} color={props.color} center>
              <input
                {...elProps}
                id={id()}
                type="radio"
                value={groupValue()}
                onFocus={mergeCallbacks(elProps.onFocus as any, () =>
                  setRadioToFocused(true)
                )}
                onBlur={mergeCallbacks(elProps.onBlur as any, () =>
                  setRadioToFocused(false)
                )}
              />
            </Ripple>
          </ClickableSignalizer>
        </div>

        <Show when={props.children}>
          <Label for={id()} hasErrors={hasErrors()}>
            {props.children}
          </Label>
        </Show>
      </div>
    );
  },
  ['value', 'children', 'color', 'disabled', 'size', 'onClick']
);

export interface RadioGroupProps<
  OwnerFormValue extends FormValue = FormValue,
  Name extends FieldName<OwnerFormValue, FormFieldValue> = FieldName<
    OwnerFormValue,
    FormFieldValue
  >,
  AllowedValue extends FieldProps<
    OwnerFormValue,
    FormFieldValue,
    Name
  >['value'] = FieldProps<OwnerFormValue, FormFieldValue, Name>['value']
> extends FieldProps<OwnerFormValue, FormFieldValue, Name> {
  label?: JSX.Element;
  helperText?: JSX.Element;

  color?: 'accent' | `accent-${string}`;
  size?: 'small' | 'medium' | 'large';
  radiosDirection?: StackProps['direction'];

  onChange?: (value: AllowedValue, event: MouseEvent) => any;

  children?:
    | JSX.Element
    | ((Option: Component<RadioGroupOptionProps<AllowedValue>>) => JSX.Element);
}

const RadioGroup = setupFieldComponent<RadioGroupProps, 'div'>(
  (props, elProps) => {
    const color = createMemo(() => props.color || 'accent');
    const {
      elementId: id,

      disabledS: [disabled],
      valueS: [_value, setValue],

      hasErrors,

      validate
    } = useField()!;

    const getChildren = accessChildren(() =>
      typeof props.children === 'function'
        ? props.children(RadioOption)
        : props.children
    );
    const options = createMemo<RadioGroupOptionProps[]>(() => {
      let childrenArr: (JSX.Element | RadioGroupOptionProps)[];

      const children = getChildren();
      if (Array.isArray(children)) {
        childrenArr = children;
      } else {
        childrenArr = [children];
      }

      return childrenArr.filter((child) => {
        return (
          child !== null &&
          typeof child === 'object' &&
          Object.hasOwn(child, 'value') &&
          Object.hasOwn(child, 'children')
        );
      }) as RadioGroupOptionProps[];
    });

    return (
      <FieldInternalWrapper
        {...elProps}
        class={mergeClass('radio-group', elProps.class)}
      >
        <Show when={props.label}>
          <Label for={id()} hasErrors={hasErrors()}>
            {props.label}
          </Label>
        </Show>

        <Stack spacing={10} direction={props.radiosDirection}>
          <For each={options()}>
            {(optionProps, i) => (
              <RadioInternal
                {...optionProps}
                tabindex={i()}
                color={optionProps.color || color()}
                size={optionProps.size || props.size || 'medium'}
                onClick={mergeCallbacks(optionProps.onClick, (e) => {
                  if (!disabled()) {
                    const newValue = optionProps.value;
                    setValue(newValue);
                    validate(newValue);

                    if (props.onChange) {
                      props.onChange(newValue, e);
                    }
                  }
                })}
              />
            )}
          </For>
        </Stack>
      </FieldInternalWrapper>
    );
  },
  [
    ...FieldPropKeys,
    'label',
    'radiosDirection',
    'helperText',
    'color',
    'size',
    'onChange',
    'children'
  ]
) as {
  <OwnerFormValue extends FormValue>(
    props: RadioGroupProps<OwnerFormValue> &
      Omit<ComponentProps<'div'>, keyof RadioGroupProps>
  ): JSX.Element;
  Option(props: RadioGroupOptionProps & ComponentProps<'input'>): JSX.Element;
};

RadioGroup.Option = RadioOption;

export default RadioGroup;
