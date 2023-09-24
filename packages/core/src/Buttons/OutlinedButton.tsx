import { extendPropsFrom, makeComponent, mergeClass } from '@terraprisma/utils';

import Button from './Button';

export interface OutlinedButtonProps {
  /**
   * @description Makes it seem as hovered but permanently.
   */
  active?: boolean;
}

const OutlinedButton = makeComponent(
  [extendPropsFrom<OutlinedButtonProps, typeof Button>(['active'])],
  (props, dftProps) => {
    return (
      <Button
        {...dftProps}
        unstyled
        class={mergeClass(
          !dftProps.disabled &&
            !dftProps.unstyled &&
            'rounded-sm border-2 border-solid border-[var(--bg)] hover:bg-[var(--bg)] hover:text-[var(--fg)]',
          !dftProps.disabled &&
            !dftProps.unstyled &&
            !props.active &&
            'bg-transparent text-[var(--bg)]',
          !dftProps.disabled &&
            !dftProps.unstyled &&
            props.active &&
            'bg-[var(--bg)] text-[var(--fg)]',
          dftProps.class
        )}
      >
        {dftProps.children}
      </Button>
    );
  }
);

export default OutlinedButton;
