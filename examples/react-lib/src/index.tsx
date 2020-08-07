import React from 'react';

export const Foobar: React.FC<FoobarProps> = (props) => {
  return <div>Hello {props.message}!</div>;
};

type FoobarProps = {
  message: string;
};
