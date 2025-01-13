import { makeStyles } from '@material-ui/core';
import React from 'react';
import { PXE_COLOR_ROSTER_RAIL, PXE_RAIL_BAR_HEIGHT_DEFAULT, PXE_RAIL_WIDTH } from '../../../PxeSharedStyles';

type PxeRosterItemRailProps = {
  readonly className?: string;
  readonly barHeight?: number;
  readonly topLeg?: boolean;
  readonly bottomLeg?: boolean;
};

export const PxeRosterItemRail: React.FC<PxeRosterItemRailProps> = ({
  className,
  barHeight = PXE_RAIL_BAR_HEIGHT_DEFAULT,
  topLeg = true,
  bottomLeg = true,
}) => {
  const clipPath = computeRailClipPath(barHeight, bottomLeg, topLeg);
  const classes = useStyles();

  return <div className={`${classes.rail} ${className}`} style={{ clipPath }} />;
};

const computeRailClipPath = (barHeight: number, bottomLeg: boolean, topLeg: boolean) => {
  const fullWidth = PXE_RAIL_WIDTH;
  const halfWidth = fullWidth / 2;
  const limitHeight = 9999; // Workaround for "path()" limitations.

  return `path(' \
      M ${fullWidth} ${barHeight} \
      L ${fullWidth} ${barHeight + 1} \
      L ${halfWidth + 1} ${barHeight + 1} \
      ${bottomLeg ? `L ${halfWidth + 1} ${limitHeight} L ${halfWidth} ${limitHeight}` : ''} \
      L ${halfWidth} ${barHeight + 1} \
      L ${halfWidth} ${barHeight} \
      ${topLeg ? `L ${halfWidth} 0  L ${halfWidth + 1} 0` : ''} \
      L ${halfWidth + 1} ${barHeight} Z \
    ')`;
};

const useStyles = makeStyles(() => ({
  rail: {
    width: PXE_RAIL_WIDTH,
    overflow: 'hidden',
    backgroundColor: PXE_COLOR_ROSTER_RAIL,

    // Prevents antialiasing by switching to hardware-accelerated rendering.
    willChange: 'transform',
  },
}));
