import { useState } from 'react';

// TODO: Add types

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useCustomForm = (initialValues:any) => {
  const [values, setValues] = useState(initialValues);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any) => {
    try {
      setValues((values) => ({
        ...values,
        [event.target.name]: event.target.value
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return { values, handleChange };
};
