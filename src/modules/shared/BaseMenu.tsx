import React, { useCallback, useContext, useMemo } from 'react';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem, { MenuItemProps } from '@material-ui/core/MenuItem';
import { RootRef } from '@material-ui/core';

interface BaseMenuContextValue {
  anchorEl: MenuProps['anchorEl'];
  openMenu: MenuItemProps['onClick'];
  closeMenu: MenuProps['onClose'];
}

const BaseMenuContext = React.createContext<BaseMenuContextValue>(
  {} as BaseMenuContextValue,
);

function useBaseMenuContext() {
  const value = useContext(BaseMenuContext);
  return value;
}

type BaseMenuProviderProps = React.PropsWithChildren<{
  value: BaseMenuContextValue;
}>;

function BaseMenuProvider({ value, children }: BaseMenuProviderProps) {
  return (
    <BaseMenuContext.Provider value={value}>
      {children}
    </BaseMenuContext.Provider>
  );
}

type BaseMenuProps = React.PropsWithChildren<{}>;

function BaseMenu({ children }: BaseMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const openMenu = useCallback((e) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const closeMenu = useCallback((e) => {
    e.stopPropagation();
    setAnchorEl(null);
  }, []);

  const contextValue = useMemo(() => ({ anchorEl, openMenu, closeMenu }), [
    anchorEl,
    openMenu,
    closeMenu,
  ]);

  return <BaseMenuProvider value={contextValue}>{children}</BaseMenuProvider>;
}

type BaseMenuListProps = React.PropsWithChildren<{}>;

export function BaseMenuList({ children }: BaseMenuListProps) {
  const { anchorEl, closeMenu } = useBaseMenuContext();
  if (!children) {
    return null;
  }
  return (
    <Menu
      id="base-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={closeMenu}
    >
      {children}
    </Menu>
  );
}

// https://material-ui.com/guides/typescript/#usage-of-component-prop
function BaseMenuItemWithoutRef<C extends React.ElementType>(
  { onClick, ...rest }: MenuItemProps<C, { component?: C }>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: any,
) {
  const { closeMenu } = useBaseMenuContext();

  const handleClick = useCallback<NonNullable<MenuItemProps['onClick']>>(
    (e) => {
      onClick?.(e);
      closeMenu?.(e, 'backdropClick');
    },
    [closeMenu, onClick],
  );

  const content = <MenuItem {...rest} onClick={handleClick} />;

  if (!ref) {
    return content;
  }

  return <RootRef rootRef={ref}>{content}</RootRef>;
}

export const BaseMenuItem = React.forwardRef(
  BaseMenuItemWithoutRef,
) as typeof BaseMenuItemWithoutRef;

type BaseMenuTriggerProps = React.PropsWithChildren<{}>;

export function BaseMenuTrigger({ children }: BaseMenuTriggerProps) {
  const { openMenu } = useBaseMenuContext();
  return (
    <>
      {React.Children.map(children, (child) => {
        // We are passing additional props to children of "BaseMenuTrigger".
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return React.cloneElement(child as any, {
          onClick: openMenu,
          // eslint-disable-next-line no-useless-computed-key
          ['aria-controls']: 'base-menu',
          // eslint-disable-next-line no-useless-computed-key
          ['aria-haspopup']: 'true',
        });
      })}
    </>
  );
}

export default BaseMenu;
