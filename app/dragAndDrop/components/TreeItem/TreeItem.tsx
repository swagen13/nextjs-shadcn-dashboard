import React, { forwardRef, HTMLAttributes } from "react";
import classNames from "classnames";

import { Action } from "./Action";
import { Remove } from "./Remove";
import styles from "./TreeItem.module.css";
import {
  BsArrowsMove,
  BsPlusSquare,
  BsArrowRight,
  BsArrowDown,
  BsEyeFill,
  BsEye,
  BsPencil,
  BsTrash,
} from "react-icons/bs"; // Import icons
import { Button } from "@/components/ui/button";

export interface Props extends HTMLAttributes<HTMLLIElement> {
  childCount?: number;
  clone?: boolean;
  collapsed?: boolean;
  depth: number;
  disableInteraction?: boolean;
  disableSelection?: boolean;
  ghost?: boolean;
  handleProps?: any;
  indicator?: boolean;
  indentationWidth: number;
  value: string;
  onCollapse?(): void;
  onRemove?(): void;
  wrapperRef?(node: HTMLLIElement): void;
  seeMore?(): void; // Add seeMore prop
}

export const TreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      indicator,
      collapsed,
      onCollapse,
      onRemove,
      seeMore, // Use seeMore prop
      style,
      value,
      wrapperRef,
      ...props
    },
    ref
  ) => {
    return (
      <li
        className={classNames(
          styles.Wrapper,
          clone && styles.clone,
          ghost && styles.ghost,
          indicator && styles.indicator,
          disableSelection && styles.disableSelection,
          disableInteraction && styles.disableInteraction
        )}
        ref={wrapperRef}
        style={
          {
            "--spacing": `${indentationWidth * depth}px`,
          } as React.CSSProperties
        }
        {...props}
      >
        <div className={styles.TreeItem} ref={ref} style={style}>
          <span className={styles.IconContainer}>
            <BsArrowsMove
              className={styles.DragHandle}
              {...handleProps}
              color="black"
            />
          </span>
          {onCollapse && (
            <Button
              className={classNames(
                styles.Collapse,
                collapsed && styles.collapsed
              )}
              onClick={onCollapse}
            >
              <span className={styles.IconContainer}>
                {collapsed ? (
                  <BsArrowRight color="black" />
                ) : (
                  <BsArrowDown color="black" />
                )}
              </span>
            </Button>
          )}
          <span className={styles.Text}>{value}</span>
          {/* See more details button */}
          <div className={styles.SeeMore}>
            <Button onClick={seeMore} className={classNames(styles.Collapse)}>
              {/* Use seeMore prop */}
              <BsEye color="black" size={18} className="mr-2" />
            </Button>
            <Button onClick={seeMore} className={classNames(styles.Collapse)}>
              {/* Use seeMore prop */}
              <BsPencil color="black" size={18} className="mr-2" />
            </Button>
            <Button onClick={seeMore} className={classNames(styles.Collapse)}>
              {/* Use seeMore prop */}
              <BsTrash color="black" size={18} />
            </Button>
          </div>
          {!clone && onRemove && <Remove onClick={onRemove} />}
          {clone && childCount && childCount > 1 ? (
            <span className={styles.Count}>{childCount}</span>
          ) : null}
        </div>
      </li>
    );
  }
);

export default TreeItem;
