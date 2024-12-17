import { makeStyles } from '@material-ui/core';
import React from 'react';

type PxeRosterItemRailProps = {
  readonly className?: string;
  readonly topLeg?: boolean;
  readonly bottomLeg?: boolean;
};

export const PxeRosterItemRail: React.FC<PxeRosterItemRailProps> = ({ className, topLeg = true, bottomLeg = true }) => {
  const aaa = 50;

  const clipPath = `path(' \
    M 32 ${aaa} \
    L 32 ${aaa + 1} \
    L 17 ${aaa + 1} \
    ${bottomLeg ? 'L 17 9999 L 16 9999' : ''} \
    L 16 ${aaa + 1} \
    L 16 ${aaa} \
    ${topLeg ? 'L 16 0  L 17 0' : ''} \
    L 17 ${aaa} Z \
  ')`;

  const classes = useStyles();

  return <div className={`${classes.gutter} ${className}`} style={{ clipPath }} />;
};

const useStyles = makeStyles(() => ({
  gutter: {
    width: '32px',
    overflow: 'hidden',
    backgroundColor: '#c4c6Cf',

    // Prevents antialiasing by switching to hardware-accelerated rendering.
    willChange: 'transform',
  },
}));
