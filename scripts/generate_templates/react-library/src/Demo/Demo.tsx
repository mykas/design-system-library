import * as React from 'react';

export interface DemoProps {
  label: string;
}

const Demo: React.FunctionComponent<DemoProps> = (props) => <div>{props.label}</div>

export default Demo;
