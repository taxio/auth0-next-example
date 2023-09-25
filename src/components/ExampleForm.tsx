'use client';

import React from "react";

interface Props {
  onSubmit: (message: string) => Promise<void>;
}

export const ExampleForm: React.FC<Props> = ({onSubmit}) => {
  const [message, setMessage] = React.useState("");

  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      await onSubmit(message).then(res => console.log(res)).catch(e => console.error(e));
    }}>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button type="submit">Submit</button>
    </form>
  );
}
